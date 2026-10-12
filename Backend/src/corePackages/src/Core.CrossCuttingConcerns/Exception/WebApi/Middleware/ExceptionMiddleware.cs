using System.Net.Mime;
using System.Text.Json;
using Core.CrossCuttingConcerns.Exception.WebApi.Handlers;
using Core.CrossCuttingConcerns.Logging;
using Core.CrossCuttingConcerns.Logging.Abstraction;
using Microsoft.AspNetCore.Http;

namespace Core.CrossCuttingConcerns.Exception.WebApi.Middleware;

public class ExceptionMiddleware(
    RequestDelegate next,
    IHttpContextAccessor contextAccessor,
    ILogger loggerService
)
{
    private readonly HttpExceptionHandler _httpExceptionHandler = new();

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (System.Exception exception)
        {
            await LogException(context, exception);
            await HandleExceptionAsync(context.Response, exception);
        }
    }

    protected virtual Task HandleExceptionAsync(HttpResponse response, dynamic exception)
    {
        response.ContentType = MediaTypeNames.Application.Json;
        _httpExceptionHandler.Response = response;

        return _httpExceptionHandler.HandleException(exception);
    }

    protected virtual Task LogException(HttpContext context, System.Exception exception)
    {
        List<LogParameter> logParameters =
        [
            new LogParameter { Type = context.GetType().Name, Value = exception.ToString() },
        ];

        LogDetail logDetail = new()
        {
            MethodName = next.Method.Name,
            Parameters = logParameters,
            User = contextAccessor.HttpContext?.User.Identity?.Name ?? "?",
        };

        loggerService.Information(JsonSerializer.Serialize(logDetail));
        return Task.CompletedTask;
    }
}
