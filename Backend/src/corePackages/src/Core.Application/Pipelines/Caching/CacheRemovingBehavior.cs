using System.Text;
using System.Text.Json;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace Core.Application.Pipelines.Caching;

public class CacheRemovingBehavior<TRequest, TResponse>(
    IDistributedCache cache,
    ILogger<CacheRemovingBehavior<TRequest, TResponse>> logger
) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, ICacheRemoverRequest
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        if (request.BypassCache)
            return await next(cancellationToken);

        TResponse response = await next(cancellationToken);

        if (request.CacheGroupKey != null)
            for (int i = 0; i < request.CacheGroupKey.Length; i++)
            {
                byte[]? cachedGroup = await cache.GetAsync(
                    request.CacheGroupKey[i],
                    cancellationToken
                );
                if (cachedGroup != null)
                {
                    HashSet<string> keysInGroup = JsonSerializer.Deserialize<HashSet<string>>(
                        Encoding.Default.GetString(cachedGroup)
                    )!;
                    foreach (string key in keysInGroup)
                    {
                        await cache.RemoveAsync(key, cancellationToken);
                        logger.LogInformation($"Removed Cache -> {key}");
                    }

                    await cache.RemoveAsync(request.CacheGroupKey[i], cancellationToken);
                    logger.LogInformation($"Removed Cache -> {request.CacheGroupKey}");
                    await cache.RemoveAsync(
                        key: $"{request.CacheGroupKey}SlidingExpiration",
                        cancellationToken
                    );
                    logger.LogInformation(
                        $"Removed Cache -> {request.CacheGroupKey}SlidingExpiration"
                    );
                }
            }

        if (request.CacheKey != null)
        {
            await cache.RemoveAsync(request.CacheKey, cancellationToken);
            logger.LogInformation($"Removed Cache -> {request.CacheKey}");
        }

        return response;
    }
}
