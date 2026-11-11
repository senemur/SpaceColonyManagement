namespace WebAPI.Controllers;

using Application.Features.Colonies.Commands.Create;
using Application.Features.Colonies.Commands.NextSol;
using Application.Features.Colonies.Commands.PerformAction;
using Application.Features.Colonies.Commands.ProcessOfflineProgress;
using Application.Features.Colonies.Queries.GetOverview;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ColoniesController : BaseController
{
    public ColoniesController(IConfiguration configuration)
        : base(configuration) { }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateColonyCommand createColonyCommand)
    {
        CreatedColonyResponse result = await Mediator.Send(createColonyCommand);
        return Created(uri: "", result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await Mediator.Send(new Application.Features.Colonies.Queries.GetAll.GetAllColoniesQuery());
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        GetColonyOverviewResponse result = await Mediator.Send(
            new GetColonyOverviewQuery { Id = id }
        );
        return Ok(result);
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview([FromQuery] int id = 1)
    {
        var result = await Mediator.Send(new GetColonyOverviewQuery { Id = id });
        return Ok(result);
    }

    [HttpPost("{id}/nextSol")]
    public async Task<IActionResult> NextSol([FromRoute] int id)
    {
        NextSolResponse result = await Mediator.Send(new NextSolCommand { ColonyId = id });
        return Ok(result);
    }

    [HttpPost("{id}/offline-progress")]
    public async Task<IActionResult> ProcessOfflineProgress([FromRoute] int id)
    {
        OfflineProgressResponse result = await Mediator.Send(
            new ProcessOfflineProgressCommand { ColonyId = id }
        );
        return Ok(result);
    }

    [HttpPost("{id}/action")]
    public async Task<IActionResult> PerformAction(
        [FromRoute] int id,
        [FromBody] PerformColonyActionCommand command
    )
    {
        command.ColonyId = id;
        PerformColonyActionResponse result = await Mediator.Send(command);
        return Ok(result);
    }
}
