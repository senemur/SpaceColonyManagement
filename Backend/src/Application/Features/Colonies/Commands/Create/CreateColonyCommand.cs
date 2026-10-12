namespace Application.Features.Colonies.Commands.Create;

using Application.Features.Colonies.Rules;
using Application.Services.Repositories;
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

    public class CreateColonyCommandHandler(
        IColonyRepository colonyRepository,
        IMapper mapper,
        ColonyBusinessRules colonyBusinessRules
    ) : IRequestHandler<CreateColonyCommand, CreatedColonyResponse>
    {
        public async Task<CreatedColonyResponse> Handle(CreateColonyCommand request, CancellationToken cancellationToken)
        {
            await colonyBusinessRules.ColonyNameCannotBeDuplicatedWhenInserted(request.Name, cancellationToken);

            Colony colony = mapper.Map<Colony>(request);
            Colony createdColony = await colonyRepository.AddAsync(colony, cancellationToken);
            return mapper.Map<CreatedColonyResponse>(createdColony);
        }
    }
}