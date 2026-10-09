namespace Application.Features.Colonies.Commands.Create;

using Application.Services;
using AutoMapper;
using Domain.Entities;
using MediatR;

public class CreateColonyCommand : IRequest<CreatedColonyResponse>
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Commander { get; set; } = null!;
    public string Planet { get; set; } = null!;
    public string Location { get; set; } = null!;

    public class CreateColonyCommandHandler
        : IRequestHandler<CreateColonyCommand, CreatedColonyResponse>
    {
        private readonly IColonyService _colonyService;
        private readonly IMapper _mapper;

        public CreateColonyCommandHandler(IColonyService colonyService, IMapper mapper)
        {
            _colonyService = colonyService;
            _mapper = mapper;
        }

        public async Task<CreatedColonyResponse> Handle(
            CreateColonyCommand request,
            CancellationToken cancellationToken
        )
        {
            Colony colony = _mapper.Map<Colony>(request);
            Colony createdColony = await _colonyService.AddAsync(colony, cancellationToken);
            CreatedColonyResponse response = _mapper.Map<CreatedColonyResponse>(createdColony);
            return response;
        }
    }
}
