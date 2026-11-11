namespace WebAPI.Controllers;

using Application.Features.Exploration.Commands.StartMission;
using Application.Features.Exploration.Queries.GetMissionsByColonyId;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

[ApiController]
[Route("api/[controller]")]
public class ExplorationController : BaseController
{
    public ExplorationController(IConfiguration configuration)
        : base(configuration) { }

    [HttpGet("colony/{colonyId}")]
    public async Task<IActionResult> GetMissionsByColonyId(
        [FromRoute] int colonyId,
        [FromQuery] int size = 50
    )
    {
        var result = await Mediator.Send(
            new GetMissionsByColonyIdQuery { ColonyId = colonyId, Size = size }
        );
        return Ok(result);
    }

    [HttpGet("missions")]
    public async Task<IActionResult> GetMissionsDefault([FromQuery] int colonyId = 1)
    {
        var result = await Mediator.Send(
            new GetMissionsByColonyIdQuery { ColonyId = colonyId }
        );
        return Ok(result);
    }

    [HttpPost("start")]
    public async Task<IActionResult> StartMission([FromBody] StartMissionCommand command)
    {
        var result = await Mediator.Send(command);
        return Ok(result);
    }
}
