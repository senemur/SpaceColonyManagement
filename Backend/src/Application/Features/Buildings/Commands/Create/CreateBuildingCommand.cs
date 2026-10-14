using Application.Features.Buildings.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using MediatR;

namespace Application.Features.Buildings.Commands.Create;

public class CreateBuildingCommand : IRequest<CreatedBuildingResponse>
{
    public int ColonyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public BuildingType BuildingType { get; set; }
    public int MaxWorkers { get; set; } = 4;
    public int PowerConsumption { get; set; } = 20;
    public int PowerProduction { get; set; } = 0;

    public class CreateBuildingCommandHandler(
        IBuildingRepository buildingRepository,
        IMapper mapper,
        BuildingBusinessRules buildingBusinessRules
    ) : IRequestHandler<CreateBuildingCommand, CreatedBuildingResponse>
    {
        public async Task<CreatedBuildingResponse> Handle(
            CreateBuildingCommand request,
            CancellationToken cancellationToken
        )
        {
            // Aynı kolonide aynı isimde bina var mı?
            await buildingBusinessRules.BuildingNameCannotBeDuplicatedInSameColony(
                request.ColonyId,
                request.Name,
                cancellationToken
            );

            Building building = mapper.Map<Building>(request);
            building.Level = 1;
            building.Health = 100;
            building.Workers = 0;
            building.IsActive = true;

            await buildingRepository.AddAsync(building);

            return mapper.Map<CreatedBuildingResponse>(building);
        }
    }
}
