namespace WebAPI.Controllers;

using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

public class BaseController : ControllerBase
{
    protected IMediator Mediator =>
        _mediator ??=
            HttpContext.RequestServices.GetService<IMediator>()
            ?? throw new InvalidOperationException(
                "IMediator cannot be retrieved from request services."
            );

    private IMediator? _mediator;

    protected readonly IConfiguration? Configuration;

    public BaseController(IConfiguration? configuration = null)
    {
        Configuration = configuration;
    }
}