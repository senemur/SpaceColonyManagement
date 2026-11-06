namespace WebAPI.Controllers;

using Application.Features.Events.Queries.GetEventsByColonyId;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

[ApiController]
[Route("api/[controller]")]
public class EventsController : BaseController
{
    public EventsController(IConfiguration configuration)
        : base(configuration) { }

    [HttpGet("colony/{colonyId}")]
    public async Task<IActionResult> GetByColonyId(
        [FromRoute] int colonyId,
        [FromQuery] int size = 50
    )
    {
        var result = await Mediator.Send(new GetEventsByColonyIdQuery
        {
            ColonyId = colonyId,
            Size = size
        });
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetDefault([FromQuery] int colonyId = 1, [FromQuery] int size = 50)
    {
        var result = await Mediator.Send(new GetEventsByColonyIdQuery
        {
            ColonyId = colonyId,
            Size = size
        });
        return Ok(result);
    }
}
