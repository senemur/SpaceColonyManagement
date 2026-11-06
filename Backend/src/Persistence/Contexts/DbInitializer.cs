namespace Persistence.Contexts;

using Domain.Entities;
using Domain.Enums;
using Domain.ValueObjects;

public static class DbInitializer
{
    public static void Initialize(BaseDbContext context)
    {
        context.Database.EnsureCreated();

        if (!context.Colonies.Any())
        {
            var colony = new Colony
            {
                Id = 1,
                Name = "Ares Prime",
                Description = "Ana merkez üssü",
                Commander = "John Ares",
                Planet = "Mars",
                Location = "Valles Marineris",
                Stats = new ColonyStats
                {
                    Sol = 2,
                    Population = 2,
                    MaxPopulation = 25,
                    Power = 250,
                    MaxPower = 250,
                    Water = 76,
                    MaxWater = 100,
                    Oxygen = 88,
                    MaxOxygen = 100,
                    Food = 296,
                    MaxFood = 500,
                    Minerals = 1000,
                    Credits = 25000,
                    SafetyScore = 100
                }
            };
            context.Colonies.Add(colony);
            context.SaveChanges();

            var solarBuilding = new Building
            {
                Id = 1,
                ColonyId = 1,
                Name = "Güneş Paneli Tarlası",
                BuildingType = BuildingType.SolarPanel,
                Level = 3,
                Health = 100,
                Workers = 0,
                MaxWorkers = 7,
                PowerConsumption = 0,
                PowerProduction = 338,
                IsActive = true
            };
            context.Buildings.Add(solarBuilding);

            var colonist1 = new Colonist
            {
                Id = 1,
                ColonyId = 1,
                Name = "Dr. Elena Gilbert",
                Role = ColonistRole.Scientist,
                Health = 100,
                Morale = 100,
                Stamina = 100,
                BuildingId = null
            };
            var colonist2 = new Colonist
            {
                Id = 2,
                ColonyId = 1,
                Name = "John Ares",
                Role = ColonistRole.Commander,
                Health = 100,
                Morale = 100,
                Stamina = 100,
                BuildingId = null
            };
            context.Colonists.AddRange(colonist1, colonist2);

            var event1 = new ColonyEvent
            {
                Id = 1,
                ColonyId = 1,
                Sol = 1,
                Title = "Ares Prime Üssü Kuruldu",
                Message = "Mars Valles Marineris kanyonunda ilk yaşam habitatı ve güneş santrali başarıyla faaliyete geçti.",
                Type = EventType.Success,
                EffectType = EventEffectType.None,
                EffectValue = 0,
                DurationInSols = 0,
                RemainingSols = 0,
                IsActive = false
            };
            var event2 = new ColonyEvent
            {
                Id = 2,
                ColonyId = 1,
                Sol = 2,
                Title = "İlk Mürettebat İnişi",
                Message = "Komutan John Ares ve Dr. Elena Gilbert üsse güvenle iniş yaptı. Koloni yaşam destek sistemleri stabil.",
                Type = EventType.Info,
                EffectType = EventEffectType.None,
                EffectValue = 0,
                DurationInSols = 0,
                RemainingSols = 0,
                IsActive = false
            };
            context.ColonyEvents.AddRange(event1, event2);

            context.SaveChanges();
        }
    }
}
