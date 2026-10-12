using Core.CrossCuttingConcerns.Exception.WebApi.Middleware;
using Microsoft.AspNetCore.Builder;

namespace Core.CrossCuttingConcerns.Exception.WebApi.Extensions;

public static class ApplicationBuilderExceptionMiddlewareExtensions
{
    public static void ConfigureCustomExceptionMiddleware(this IApplicationBuilder app)
    {
        app.UseMiddleware<ExceptionMiddleware>();
    }
}
