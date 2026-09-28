using Entities.Buildings;
using Entities.Colonists;
using Entities.Resources;
using Entities.Users;

namespace Entities.Colonies;

public class Colony
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Planet { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime LastActiveAt { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public decimal ResourceCapacity { get; set; } = 500;

    public ICollection<Colonist> Colonists { get; set; } = new List<Colonist>();

    public ICollection<ColonyResource> Resources { get; set; } = new List<ColonyResource>();

    public ICollection<Building> Buildings { get; set; } = new List<Building>();
}
