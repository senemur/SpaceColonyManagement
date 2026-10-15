using Application.Features.Buildings.Commands.ToggleStatus;
using Application.Features.Buildings.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Backend.Application.Features.Buildings.Commands.ToggleStatus
{
    public class ToggleBuildingStatusCommand : IRequest<ToggleBuildingStatusResponse>
    {
        public int Id { get; set; }

        public class ToggleBuildingStatusCommandHandler(
            IBuildingRepository buildingRepository,
            IMapper mapper,
            BuildingBusinessRules buildingBusinessRules
        ) : IRequestHandler<ToggleBuildingStatusCommand, ToggleBuildingStatusResponse>
        {
            public async Task<ToggleBuildingStatusResponse> Handle(
                ToggleBuildingStatusCommand request,
                CancellationToken cancellationToken
            )
            {
                Building? building = await buildingRepository.GetAsync(
                    predicate: b => b.Id == request.Id,
                    cancellationToken: cancellationToken
                );

                await buildingBusinessRules.BuildingShouldExistWhenSelected(building);

                Building existingBuilding = building!;
                existingBuilding.IsActive = !existingBuilding.IsActive;
                await buildingRepository.UpdateAsync(existingBuilding, cancellationToken);

                return mapper.Map<ToggleBuildingStatusResponse>(existingBuilding);
            }
        }
    }
}
