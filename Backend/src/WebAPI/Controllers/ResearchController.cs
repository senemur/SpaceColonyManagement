namespace WebAPI.Controllers;

using Application.Features.Research.Commands.StartResearch;
using Application.Features.Research.Queries.GetTechTree;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

[ApiController]
[Route("api/[controller]")]
public class ResearchController : BaseController
{
    public ResearchController(IConfiguration configuration)
        : base(configuration) { }

    [HttpGet("colony/{colonyId}")]
    public async Task<IActionResult> GetTechTree([FromRoute] int colonyId)
    {
        var result = await Mediator.Send(new GetTechTreeQuery { ColonyId = colonyId });
        return Ok(result);
    }

    [HttpGet("tech-tree")]
    public async Task<IActionResult> GetTechTreeDefault([FromQuery] int colonyId = 1)
    {
        var result = await Mediator.Send(new GetTechTreeQuery { ColonyId = colonyId });
        return Ok(result);
    }

    [HttpPost("start")]
    public async Task<IActionResult> StartResearch([FromBody] StartResearchCommand command)
    {
        var result = await Mediator.Send(command);
        return Ok(result);
    }
}
