using Domain.Enums;

namespace Application.Features.Buildings.Commands.Create;

public class CreatedBuildingResponse
{
    public int Id { get; set; }
    public int ColonyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public BuildingType BuildingType { get; set; }
    public int Level { get; set; }
    public int Health { get; set; }
    public int Workers { get; set; }
    public int MaxWorkers { get; set; }
    public int PowerConsumption { get; set; }
    public int PowerProduction { get; set; }
    public bool IsActive { get; set; }
}
