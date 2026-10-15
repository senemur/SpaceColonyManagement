namespace WebAPI.Controllers;

using Application.Features.Buildings.Commands.Create;
using Application.Features.Buildings.Commands.ToggleStatus;
using Application.Features.Buildings.Commands.Upgrade;
using Application.Features.Buildings.Queries.GetListByColonyId;
using Backend.Application.Features.Buildings.Commands.ToggleStatus;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

[ApiController]
[Route("api/[controller]")]
public class BuildingsController : BaseController
{
    public BuildingsController(IConfiguration configuration)
        : base(configuration) { }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBuildingCommand command)
    {
        var result = await Mediator.Send(command);
        return Created("", result);
    }

    [HttpPut("upgrade")]
    public async Task<IActionResult> Upgrade([FromBody] UpgradeBuildingCommand command)
    {
        var result = await Mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("colony/{colonyId}")]
    public async Task<IActionResult> GetListByColonyId(
        [FromRoute] int colonyId,
        [FromQuery] int index = 0,
        [FromQuery] int size = 50
    )
    {
        var result = await Mediator.Send(
            new GetListByColonyIdBuildingQuery
            {
                ColonyId = colonyId,
                Index = index,
                Size = size,
            }
        );
        return Ok(result);
    }

    [HttpPut("{id}/toggle-status")]
    public async Task<IActionResult> ToggleStatus([FromRoute] int id)
    {
        ToggleBuildingStatusResponse result = await Mediator.Send(
            new ToggleBuildingStatusCommand { Id = id }
        );
        return Ok(result);
    }
}
