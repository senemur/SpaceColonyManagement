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
                LastActiveDate = DateTime.UtcNow.AddMinutes(-30),
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

            var mission1 = new ExplorationMission
            {
                Id = 1,
                ColonyId = 1,
                Name = "Görünmeyen Kanyon Buz Analizi",
                TargetZone = "Güney Krateri A-2",
                Description = "Kanyonun gölgede kalan krater tabanında buzul yatakları ve su kaynakları taranacak.",
                RiskLevel = MissionRiskLevel.Low,
                Status = MissionStatus.Available,
                DurationInSols = 1,
                RemainingSols = 1,
                EnergyCost = 25,
                WaterCost = 5,
                CreditsCost = 0,
                RewardMinerals = 50,
                RewardWater = 250,
                RewardCredits = 100,
                RewardDescription = "+250 Su, +50 Maden, +100 Kredi"
            };

            var mission2 = new ExplorationMission
            {
                Id = 2,
                ColonyId = 1,
                Name = "Olympus Mons Vadi Taraması",
                TargetZone = "Kuzey Sektörü 4",
                Description = "Güneş sisteminin en yüksek volkanının eteklerinde yüksek tenörlü demir ve titanyum cevherleşmesi aranacak.",
                RiskLevel = MissionRiskLevel.Medium,
                Status = MissionStatus.Available,
                DurationInSols = 2,
                RemainingSols = 2,
                EnergyCost = 50,
                WaterCost = 15,
                CreditsCost = 200,
                RewardMinerals = 400,
                RewardWater = 150,
                RewardCredits = 500,
                RewardDescription = "+400 Maden, +150 Su, +500 Kredi"
            };

            var mission3 = new ExplorationMission
            {
                Id = 3,
                ColonyId = 1,
                Name = "Eski Yeraltı Mağara Araştırması",
                TargetZone = "Derin Lav Tüpleri B-9",
                Description = "Yüzey radyasyonundan izole lav tüplerinde jeolojik yapı ve gizemli artefakt arayışı.",
                RiskLevel = MissionRiskLevel.High,
                Status = MissionStatus.Available,
                DurationInSols = 3,
                RemainingSols = 3,
                EnergyCost = 90,
                WaterCost = 25,
                CreditsCost = 500,
                RewardMinerals = 650,
                RewardWater = 300,
                RewardCredits = 2000,
                RewardDescription = "+650 Maden, +300 Su, +2000 Kredi & Nadir Artefakt"
            };

            var mission4 = new ExplorationMission
            {
                Id = 4,
                ColonyId = 1,
                Name = "Elysium Krateri Jeotermal Taraması",
                TargetZone = "Elysium Planitia",
                Description = "Volkanik kökenli sıcak su buharı çıkışları ve kristalize mineral tabakaları taranacak.",
                RiskLevel = MissionRiskLevel.Medium,
                Status = MissionStatus.Available,
                DurationInSols = 2,
                RemainingSols = 2,
                EnergyCost = 40,
                WaterCost = 10,
                CreditsCost = 300,
                RewardMinerals = 300,
                RewardWater = 100,
                RewardCredits = 800,
                RewardDescription = "+300 Maden, +100 Su, +800 Kredi"
            };

            context.ExplorationMissions.AddRange(mission1, mission2, mission3, mission4);

            context.SaveChanges();
        }
    }
}
