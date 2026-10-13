namespace Application.Features.Buildings.Commands.Upgrade;

public class UpgradedBuildingResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Level { get; set; }
    public int Health { get; set; }
    public int MaxWorkers { get; set; }
    public int PowerProduction { get; set; }
    public int PowerConsumption { get; set; }
}
