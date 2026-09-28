using Entities.Colonies;

namespace Entities.Colonists;

public class Colonist
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Age { get; set; }

    public int Health { get; set; }

    public int Happiness { get; set; }

    public int ColonyId { get; set; }

    public Colony Colony { get; set; } = null!;
}
