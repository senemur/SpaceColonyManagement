using Core.Persistence.Repositories;
using Domain.Enums;

namespace Domain.Entities;

public class Building : Entity<int>
{
    public int ColonyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public BuildingType BuildingType { get; set; }
    public int Level { get; set; }
    public int Health { get; set; } // 0 - 100 arası dayanıklılık/sağlık
    public int Workers { get; set; } // Şu anki çalışan sayısı
    public int MaxWorkers { get; set; } // Maksimum çalışan kapasitesi
    public int PowerConsumption { get; set; } // Tükettiği enerji (kW)
    public int PowerProduction { get; set; } // Ürettiği enerji (kW)
    public bool IsActive { get; set; }

    // Navigation Property
    public virtual Colony? Colony { get; set; }
    public virtual ICollection<Colonist> WorkersList { get; set; } = new List<Colonist>();

    public Building()
    {
        Level = 1;
        Health = 100;
        IsActive = true;
    }

    public Building(
        int colonyId,
        string name,
        BuildingType buildingType,
        int level,
        int health,
        int workers,
        int maxWorkers,
        int powerConsumption,
        int powerProduction,
        bool isActive
    )
    {
        ColonyId = colonyId;
        Name = name;
        BuildingType = buildingType;
        Level = level;
        Health = health;
        Workers = workers;
        MaxWorkers = maxWorkers;
        PowerConsumption = powerConsumption;
        PowerProduction = powerProduction;
        IsActive = isActive;
    }

    public Building(
        int id,
        int colonyId,
        string name,
        BuildingType buildingType,
        int level,
        int health,
        int workers,
        int maxWorkers,
        int powerConsumption,
        int powerProduction,
        bool isActive
    )
        : base(id)
    {
        ColonyId = colonyId;
        Name = name;
        BuildingType = buildingType;
        Level = level;
        Health = health;
        Workers = workers;
        MaxWorkers = maxWorkers;
        PowerConsumption = powerConsumption;
        PowerProduction = powerProduction;
        IsActive = isActive;
    }
}
