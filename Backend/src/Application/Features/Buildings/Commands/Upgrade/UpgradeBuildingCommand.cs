using Application.Features.Buildings.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.Buildings.Commands.Upgrade;

public class UpgradeBuildingCommand : IRequest<UpgradedBuildingResponse>
{
    public int Id { get; set; }

    public class UpgradeBuildingCommandHandler(
        IBuildingRepository buildingRepository,
        IMapper mapper,
        BuildingBusinessRules buildingBusinessRules
    ) : IRequestHandler<UpgradeBuildingCommand, UpgradedBuildingResponse>
    {
        public async Task<UpgradedBuildingResponse> Handle(
            UpgradeBuildingCommand request,
            CancellationToken cancellationToken
        )
        {
            Building? building = await buildingRepository.GetAsync(
                predicate: b => b.Id == request.Id,
                cancellationToken: cancellationToken
            );

            await buildingBusinessRules.BuildingShouldExistWhenSelected(building);
            await buildingBusinessRules.BuildingMustBeActiveToUpgrade(building!.IsActive);
            await buildingBusinessRules.BuildingLevelCannotExceedMaxLimit(building.Level);

            // Yükseltme formülü: Seviye + 1, Kapasite %25 artar, Enerji tüketimi/üretimi %30 artar
            building.Level += 1;
            building.MaxWorkers = (int)Math.Ceiling(building.MaxWorkers * 1.25);
            if (building.PowerProduction > 0)
                building.PowerProduction = (int)Math.Ceiling(building.PowerProduction * 1.3);
            if (building.PowerConsumption > 0)
                building.PowerConsumption = (int)Math.Ceiling(building.PowerConsumption * 1.3);

            await buildingRepository.UpdateAsync(building);

            return mapper.Map<UpgradedBuildingResponse>(building);
        }
    }
}
