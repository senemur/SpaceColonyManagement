namespace Domain.Entities;

using Domain.Entities.Common;
using Domain.ValueObjects;

public class Colony : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Planet { get; set; } = null!;
    public string Description { get; set; } = string.Empty;
    public string Commander { get; set; } = null!;
    public string Location { get; set; } = null!;

    public ColonyStats Stats { get; set; } = new ColonyStats();

    public Colony()
    {
    }

    public Colony(string name, string description, string commander, string location, string planet,ColonyStats? stats = null)
    {
        Name = name;
        Description = description;
        Commander = commander;
        Location = location;
        Planet = planet;
        Stats = stats ?? new ColonyStats();
    }

     // 3. Constructor with Id (Test & Mocking için)
    public Colony(int id, string name, string description, string commander, string location, string planet, ColonyStats? stats = null)
        : this(name, description, commander, location, planet, stats)
    {
        Id = id;
    }

}