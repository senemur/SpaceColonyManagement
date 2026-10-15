namespace Domain.Entities;

using Core.Persistence.Repositories;
using Domain.Enums;

public class Colonist : Entity<int>
{
    public int ColonyId { get; set; }
    public int? BuildingId { get; set; } // Boştaysa null, atanmışsa bina ID
    public string Name { get; set; } = string.Empty;
    public ColonistRole Role { get; set; }
    public int Health { get; set; } // 0 - 100
    public int Morale { get; set; } // 0 - 100
    public bool IsAssigned => BuildingId.HasValue;

    // Navigation Properties
    public virtual Colony? Colony { get; set; }
    public virtual Building? Building { get; set; }

    public Colonist()
    {
        Health = 100;
        Morale = 100;
    }

    public Colonist(
        int colonyId,
        string name,
        ColonistRole role,
        int health = 100,
        int morale = 100,
        int? buildingId = null
    )
    {
        ColonyId = colonyId;
        Name = name;
        Role = role;
        Health = health;
        Morale = morale;
        BuildingId = buildingId;
    }

    public Colonist(
        int id,
        int colonyId,
        string name,
        ColonistRole role,
        int health = 100,
        int morale = 100,
        int? buildingId = null
    )
        : base(id)
    {
        ColonyId = colonyId;
        Name = name;
        Role = role;
        Health = health;
        Morale = morale;
        BuildingId = buildingId;
    }
}
