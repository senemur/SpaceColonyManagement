namespace Application.Features.Colonists.Commands.AssignToBuilding;

using Application.Features.Colonists.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

public class AssignColonistToBuildingCommand : IRequest<AssignedColonistToBuildingResponse>
{
    public int ColonistId { get; set; }
    public int? BuildingId { get; set; } // null ise görevden çıkar

    public class AssignColonistToBuildingCommandHandler(
        IColonistRepository colonistRepository,
        IBuildingRepository buildingRepository,
        IMapper mapper,
        ColonistBusinessRules colonistBusinessRules
    ) : IRequestHandler<AssignColonistToBuildingCommand, AssignedColonistToBuildingResponse>
    {
        public async Task<AssignedColonistToBuildingResponse> Handle(
            AssignColonistToBuildingCommand request,
            CancellationToken cancellationToken
        )
        {
            Colonist? colonist = await colonistRepository.GetAsync(
                predicate: c => c.Id == request.ColonistId,
                cancellationToken: cancellationToken
            );

            await colonistBusinessRules.ColonistShouldExistWhenSelected(colonist);

            // Eğer yeni bir binaya atanıyorsa kontrolleri yap
            if (request.BuildingId.HasValue)
            {
                await colonistBusinessRules.ColonistShouldBeHealthyEnoughToWork(colonist!.Health);

                await colonistBusinessRules.ColonistShouldHaveEnoughStaminaToWork(colonist.Stamina);

                Building? newBuilding = await buildingRepository.GetAsync(
                    predicate: b => b.Id == request.BuildingId.Value,
                    cancellationToken: cancellationToken
                );

                if (newBuilding == null)
                    throw new Core.CrossCuttingConcerns.Exception.Types.BusinessException(
                        Constants.ColonistsMessages.BuildingNotFound
                    );

                await colonistBusinessRules.BuildingShouldBeActiveToAssign(newBuilding.IsActive);
                await colonistBusinessRules.BuildingCapacityShouldNotBeExceeded(
                    newBuilding.Workers,
                    newBuilding.MaxWorkers
                );

                // Eski binasından ayrılıyorsa eski binanın çalışan sayısını düşür
                if (colonist.BuildingId.HasValue && colonist.BuildingId != request.BuildingId)
                {
                    Building? oldBuilding = await buildingRepository.GetAsync(
                        predicate: b => b.Id == colonist.BuildingId.Value,
                        cancellationToken: cancellationToken
                    );
                    if (oldBuilding != null && oldBuilding.Workers > 0)
                    {
                        oldBuilding.Workers -= 1;
                        await buildingRepository.UpdateAsync(oldBuilding);
                    }
                }

                // Yeni binanın çalışan sayısını artır
                newBuilding.Workers += 1;
                await buildingRepository.UpdateAsync(newBuilding);

                colonist.BuildingId = request.BuildingId;
            }
            else
            {
                // Görevden boşa çıkarılıyorsa
                if (colonist!.BuildingId.HasValue)
                {
                    Building? oldBuilding = await buildingRepository.GetAsync(
                        predicate: b => b.Id == colonist.BuildingId.Value,
                        cancellationToken: cancellationToken
                    );
                    if (oldBuilding != null && oldBuilding.Workers > 0)
                    {
                        oldBuilding.Workers -= 1;
                        await buildingRepository.UpdateAsync(oldBuilding);
                    }
                }

                colonist.BuildingId = null;
            }

            await colonistRepository.UpdateAsync(colonist);

            return mapper.Map<AssignedColonistToBuildingResponse>(colonist);
        }
    }
}
