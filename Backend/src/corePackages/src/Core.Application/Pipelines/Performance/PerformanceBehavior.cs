using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Core.Application.Pipelines.Performance;

public class PerformanceBehavior<TRequest, TResponse>(
    ILogger<PerformanceBehavior<TRequest, TResponse>> logger,
    Stopwatch stopwatch
) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, IIntervalRequest
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        string requestName = request.GetType().Name;

        TResponse response;

        try
        {
            stopwatch.Start();
            response = await next(cancellationToken);
        }
        finally
        {
            if (stopwatch.Elapsed.TotalSeconds > request.Interval)
            {
                string message = $"Performance -> {requestName} {stopwatch.Elapsed.TotalSeconds} s";

                Debug.WriteLine(message);
                logger.LogInformation(message);
            }

            stopwatch.Restart();
        }

        return response;
    }
}
