using System.Text;
using System.Text.Json;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Core.Application.Pipelines.Caching;

public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, ICachableRequest
{
    private readonly CacheSettings _cacheSettings;
    private readonly IDistributedCache _cache;
    private readonly ILogger<CachingBehavior<TRequest, TResponse>> _logger;

    public CachingBehavior(
        IDistributedCache cache,
        ILogger<CachingBehavior<TRequest, TResponse>> logger,
        IConfiguration configuration
    )
    {
        const string cacheSettingsConfigurationSection = "CacheSettings";
        _cacheSettings =
            configuration.GetSection(cacheSettingsConfigurationSection).Get<CacheSettings>()
            ?? throw new NullReferenceException(
                $"\"{cacheSettingsConfigurationSection}\" section cannot found in configuration"
            );

        _cache = cache;
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        if (request.BypassCache)
            return await next(cancellationToken);

        TResponse response;
        byte[]? cachedResponse = await _cache.GetAsync(request.CacheKey, cancellationToken);
        if (cachedResponse != null)
        {
            response = JsonSerializer.Deserialize<TResponse>(
                Encoding.Default.GetString(cachedResponse)
            )!;
            _logger.LogInformation($"Fetched from Cache -> {request.CacheKey}");
        }
        else
            response = await GetResponseAndAddToCache(request, next, cancellationToken);

        return response;
    }

    private async Task<TResponse> GetResponseAndAddToCache(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        TResponse response = await next(cancellationToken);

        TimeSpan slidingExpiration =
            request.SlidingExpiration ?? TimeSpan.FromDays(_cacheSettings.SlidingExpiration);
        DistributedCacheEntryOptions cacheOptions = new() { SlidingExpiration = slidingExpiration };

        byte[] serializeData = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(response));
        await _cache.SetAsync(request.CacheKey, serializeData, cacheOptions, cancellationToken);
        _logger.LogInformation($"Added to Cache -> {request.CacheKey}");

        if (request.CacheGroupKey != null)
            await AddCacheKeyToGroup(request, slidingExpiration, cancellationToken);

        return response;
    }

    private async Task AddCacheKeyToGroup(
        TRequest request,
        TimeSpan slidingExpiration,
        CancellationToken cancellationToken
    )
    {
        byte[]? cacheGroupCache = await _cache.GetAsync(
            key: request.CacheGroupKey!,
            cancellationToken
        );
        HashSet<string> cacheKeysInGroup;
        if (cacheGroupCache != null)
        {
            cacheKeysInGroup = JsonSerializer.Deserialize<HashSet<string>>(
                Encoding.Default.GetString(cacheGroupCache)
            )!;
            if (!cacheKeysInGroup.Contains(request.CacheKey))
                cacheKeysInGroup.Add(request.CacheKey);
        }
        else
            cacheKeysInGroup = [request.CacheKey];
        byte[] newCacheGroupCache = JsonSerializer.SerializeToUtf8Bytes(cacheKeysInGroup);

        byte[]? cacheGroupCacheSlidingExpirationCache = await _cache.GetAsync(
            key: $"{request.CacheGroupKey}SlidingExpiration",
            cancellationToken
        );
        int? cacheGroupCacheSlidingExpirationValue = null;
        if (cacheGroupCacheSlidingExpirationCache != null)
            cacheGroupCacheSlidingExpirationValue = Convert.ToInt32(
                Encoding.Default.GetString(cacheGroupCacheSlidingExpirationCache)
            );
        if (
            cacheGroupCacheSlidingExpirationValue == null
            || slidingExpiration.TotalSeconds > cacheGroupCacheSlidingExpirationValue
        )
            cacheGroupCacheSlidingExpirationValue = Convert.ToInt32(slidingExpiration.TotalSeconds);
        byte[] serializeCachedGroupSlidingExpirationData = JsonSerializer.SerializeToUtf8Bytes(
            cacheGroupCacheSlidingExpirationValue
        );

        DistributedCacheEntryOptions cacheOptions = new()
        {
            SlidingExpiration = TimeSpan.FromSeconds(
                Convert.ToDouble(cacheGroupCacheSlidingExpirationValue)
            ),
        };

        await _cache.SetAsync(
            key: request.CacheGroupKey!,
            newCacheGroupCache,
            cacheOptions,
            cancellationToken
        );
        _logger.LogInformation($"Added to Cache -> {request.CacheGroupKey}");

        await _cache.SetAsync(
            key: $"{request.CacheGroupKey}SlidingExpiration",
            serializeCachedGroupSlidingExpirationData,
            cacheOptions,
            cancellationToken
        );
        _logger.LogInformation($"Added to Cache -> {request.CacheGroupKey}SlidingExpiration");
    }
}
