using System.Text.Json;
using Core.CrossCuttingConcerns.Logging;
using Core.CrossCuttingConcerns.Logging.Abstraction;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Core.Application.Pipelines.Logging;

public class LoggingBehavior<TRequest, TResponse>(
    ILogger logger,
    IHttpContextAccessor httpContextAccessor
) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, ILoggableRequest
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        List<LogParameter> logParameters =
        [
            new LogParameter { Type = request.GetType().Name, Value = request },
        ];

        LogDetail logDetail = new()
        {
            MethodName = next.Method.Name,
            Parameters = logParameters,
            User = httpContextAccessor.HttpContext.User.Identity?.Name ?? "?",
        };

        logger.Information(JsonSerializer.Serialize(logDetail));
        return await next(cancellationToken);
    }
}
