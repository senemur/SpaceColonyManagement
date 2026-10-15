namespace Application.Features.Colonists.Commands.Create;

using Application.Features.Colonists.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using MediatR;

public class CreateColonistCommand : IRequest<CreatedColonistResponse>
{
    public int ColonyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public ColonistRole Role { get; set; } = ColonistRole.Worker;

    public class CreateColonistCommandHandler(
        IColonistRepository colonistRepository,
        IMapper mapper,
        ColonistBusinessRules colonistBusinessRules
    ) : IRequestHandler<CreateColonistCommand, CreatedColonistResponse>
    {
        public async Task<CreatedColonistResponse> Handle(
            CreateColonistCommand request,
            CancellationToken cancellationToken
        )
        {
            await colonistBusinessRules.ColonistNameCannotBeDuplicatedInSameColony(
                request.ColonyId,
                request.Name,
                cancellationToken
            );

            Colonist colonist = mapper.Map<Colonist>(request);
            colonist.Health = 100;
            colonist.Morale = 100;
            colonist.BuildingId = null;

            await colonistRepository.AddAsync(colonist);

            return mapper.Map<CreatedColonistResponse>(colonist);
        }
    }
}
