using Entities.Colonies;

namespace Entities.Resources;

public class ColonyResource
{
    public int Id { get; set; }

    public ResourceType Type { get; set; }

    public decimal Amount { get; set; }

    public int ColonyId { get; set; }

    public Colony Colony { get; set; } = null!;
}
