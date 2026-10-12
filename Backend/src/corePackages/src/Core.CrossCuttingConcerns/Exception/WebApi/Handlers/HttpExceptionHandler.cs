using Core.CrossCuttingConcerns.Exception.Handlers;
using Core.CrossCuttingConcerns.Exception.Types;
using Core.CrossCuttingConcerns.Exception.WebApi.Extensions;
using Core.CrossCuttingConcerns.Exception.WebApi.HttpProblemDetails;
using Microsoft.AspNetCore.Http;

namespace Core.CrossCuttingConcerns.Exception.WebApi.Handlers;

public class HttpExceptionHandler : ExceptionHandler
{
    public HttpResponse Response
    {
        get => _response ?? throw new NullReferenceException(nameof(_response));
        set => _response = value;
    }

    private HttpResponse? _response;

    public override Task HandleException(BusinessException businessException)
    {
        Response.StatusCode = StatusCodes.Status400BadRequest;
        string details = new BusinessProblemDetails(businessException.Message).ToJson();
        return Response.WriteAsync(details);
    }

    public override Task HandleException(ConflictException conflictException)
    {
        Response.StatusCode = StatusCodes.Status409Conflict;
        string details = new BusinessProblemDetails(conflictException.Message).ToJson();
        return Response.WriteAsync(details);
    }

    public override Task HandleException(ValidationException validationException)
    {
        Response.StatusCode = StatusCodes.Status400BadRequest;
        string details = new ValidationProblemDetails(validationException.Errors).ToJson();
        return Response.WriteAsync(details);
    }

    public override Task HandleException(AuthorizationException authorizationException)
    {
        Response.StatusCode = StatusCodes.Status401Unauthorized;
        string details = new AuthorizationProblemDetails(authorizationException.Message).ToJson();
        return Response.WriteAsync(details);
    }

    public override Task HandleException(NotFoundException notFoundException)
    {
        Response.StatusCode = StatusCodes.Status404NotFound;
        string details = new NotFoundProblemDetails(notFoundException.Message).ToJson();
        return Response.WriteAsync(details);
    }

    public override Task HandleException(System.Exception exception)
    {
        Response.StatusCode = StatusCodes.Status500InternalServerError;
        string details = new InternalServerErrorProblemDetails(exception.Message).ToJson();
        return Response.WriteAsync(details);
    }
}
