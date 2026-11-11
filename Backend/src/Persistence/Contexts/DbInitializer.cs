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
                    Population = 6,
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
                Workers = 1,
                MaxWorkers = 7,
                PowerConsumption = 0,
                PowerProduction = 338,
                IsActive = true
            };

            var habitatBuilding = new Building
            {
                Id = 2,
                ColonyId = 1,
                Name = "Ares Yaşam Modülü",
                BuildingType = BuildingType.Habitat,
                Level = 2,
                Health = 96,
                Workers = 1,
                MaxWorkers = 6,
                PowerConsumption = 15,
                PowerProduction = 0,
                IsActive = true
            };

            var farmBuilding = new Building
            {
                Id = 3,
                ColonyId = 1,
                Name = "Hidroponik Tarım Serası",
                BuildingType = BuildingType.Greenhouse,
                Level = 1,
                Health = 95,
                Workers = 1,
                MaxWorkers = 4,
                PowerConsumption = 20,
                PowerProduction = 0,
                IsActive = true
            };

            var waterBuilding = new Building
            {
                Id = 4,
                ColonyId = 1,
                Name = "Yeraltı Su Sondaj İstasyonu",
                BuildingType = BuildingType.WaterExtractor,
                Level = 1,
                Health = 90,
                Workers = 0,
                MaxWorkers = 3,
                PowerConsumption = 25,
                PowerProduction = 0,
                IsActive = true
            };

            var mineBuilding = new Building
            {
                Id = 5,
                ColonyId = 1,
                Name = "Regolit Maden Ocağı",
                BuildingType = BuildingType.Mine,
                Level = 1,
                Health = 85,
                Workers = 1,
                MaxWorkers = 4,
                PowerConsumption = 30,
                PowerProduction = 0,
                IsActive = true
            };

            var labBuilding = new Building
            {
                Id = 6,
                ColonyId = 1,
                Name = "Mars Araştırma Laboratuvarı",
                BuildingType = BuildingType.ResearchLab,
                Level = 1,
                Health = 92,
                Workers = 1,
                MaxWorkers = 3,
                PowerConsumption = 35,
                PowerProduction = 0,
                IsActive = true
            };

            context.Buildings.AddRange(solarBuilding, habitatBuilding, farmBuilding, waterBuilding, mineBuilding, labBuilding);

            var colonist1 = new Colonist
            {
                Id = 1,
                ColonyId = 1,
                Name = "Dr. Elena Gilbert",
                Role = ColonistRole.Scientist,
                Health = 100,
                Morale = 100,
                Stamina = 100,
                BuildingId = 6
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
                BuildingId = 2
            };
            var colonist3 = new Colonist
            {
                Id = 3,
                ColonyId = 1,
                Name = "Mert Arslan",
                Role = ColonistRole.Biologist,
                Health = 95,
                Morale = 90,
                Stamina = 95,
                BuildingId = 3
            };
            var colonist4 = new Colonist
            {
                Id = 4,
                ColonyId = 1,
                Name = "Deniz Kaya",
                Role = ColonistRole.Miner,
                Health = 90,
                Morale = 85,
                Stamina = 90,
                BuildingId = 5
            };
            var colonist5 = new Colonist
            {
                Id = 5,
                ColonyId = 1,
                Name = "Ayşe Yılmaz",
                Role = ColonistRole.Engineer,
                Health = 95,
                Morale = 95,
                Stamina = 90,
                BuildingId = 1
            };
            var colonist6 = new Colonist
            {
                Id = 6,
                ColonyId = 1,
                Name = "Can Öztürk",
                Role = ColonistRole.Doctor,
                Health = 100,
                Morale = 95,
                Stamina = 100,
                BuildingId = 2
            };
            context.Colonists.AddRange(colonist1, colonist2, colonist3, colonist4, colonist5, colonist6);

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
