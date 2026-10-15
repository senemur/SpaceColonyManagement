namespace WebAPI.Controllers;

using Application.Features.Colonists.Commands.AssignToBuilding;
using Application.Features.Colonists.Commands.Create;
using Application.Features.Colonists.Queries.GetListByColonyId;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ColonistsController : BaseController
{
    public ColonistsController(IConfiguration configuration)
        : base(configuration) { }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateColonistCommand command)
    {
        CreatedColonistResponse result = await Mediator.Send(command);
        return Created("", result);
    }

    [HttpPut("assignToBuilding")]
    public async Task<IActionResult> AssignToBuilding(
        [FromBody] AssignColonistToBuildingCommand command
    )
    {
        AssignedColonistToBuildingResponse result = await Mediator.Send(command);
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
            new GetListByColonyIdColonistQuery
            {
                ColonyId = colonyId,
                Index = index,
                Size = size,
            }
        );
        return Ok(result);
    }
}
