using Entities.Colonies;

namespace Entities.Buildings;

public class Building
{
    public int Id { get; set; }

    public BuildingType Type { get; set; }

    public int Level { get; set; }

    public int WorkerCount { get; set; }

    public int ColonyId { get; set; }

    public Colony Colony { get; set; } = null!;
}
