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

        if (!context.Colonies.Any(c => c.Id == 2))
        {
            var colony2 = new Colony
            {
                Id = 2,
                Name = "Olympus Station",
                Description = "Olympus Mons volkanik platosundaki araştırma ve yüksek irtifa jeotermal üssü.",
                Commander = "Dr. Hakan Vural",
                Planet = "Mars",
                Location = "Olympus Mons",
                LastActiveDate = DateTime.UtcNow.AddMinutes(-15),
                Stats = new ColonyStats
                {
                    Sol = 142,
                    Population = 12,
                    MaxPopulation = 24,
                    Power = 380,
                    MaxPower = 500,
                    Water = 85,
                    MaxWater = 100,
                    Oxygen = 96,
                    MaxOxygen = 100,
                    Food = 410,
                    MaxFood = 600,
                    Minerals = 2850,
                    Credits = 45000,
                    SafetyScore = 94
                }
            };
            context.Colonies.Add(colony2);
            context.SaveChanges();

            var b7 = new Building { Id = 7, ColonyId = 2, Name = "Olympus Jeotermal Santrali", BuildingType = BuildingType.SolarPanel, Level = 4, Health = 98, Workers = 2, MaxWorkers = 8, PowerConsumption = 0, PowerProduction = 420, IsActive = true };
            var b8 = new Building { Id = 8, ColonyId = 2, Name = "Olympus Zirve Yaşam Kubbesi", BuildingType = BuildingType.Habitat, Level = 3, Health = 95, Workers = 2, MaxWorkers = 12, PowerConsumption = 25, PowerProduction = 0, IsActive = true };
            var b9 = new Building { Id = 9, ColonyId = 2, Name = "Yüksek İrtifa Hidroponik Serası", BuildingType = BuildingType.Greenhouse, Level = 2, Health = 92, Workers = 3, MaxWorkers = 6, PowerConsumption = 30, PowerProduction = 0, IsActive = true };
            var b10 = new Building { Id = 10, ColonyId = 2, Name = "Magma Altı Su Sondaj İstasyonu", BuildingType = BuildingType.WaterExtractor, Level = 2, Health = 88, Workers = 2, MaxWorkers = 5, PowerConsumption = 35, PowerProduction = 0, IsActive = true };
            var b11 = new Building { Id = 11, ColonyId = 2, Name = "Lav Tüpü Ağır Maden Kompleksi", BuildingType = BuildingType.Mine, Level = 3, Health = 90, Workers = 3, MaxWorkers = 8, PowerConsumption = 45, PowerProduction = 0, IsActive = true };
            var b12 = new Building { Id = 12, ColonyId = 2, Name = "Atmosferik & Jeoloji Araştırma Labı", BuildingType = BuildingType.ResearchLab, Level = 3, Health = 97, Workers = 2, MaxWorkers = 5, PowerConsumption = 40, PowerProduction = 0, IsActive = true };
            context.Buildings.AddRange(b7, b8, b9, b10, b11, b12);

            var c7 = new Colonist { Id = 7, ColonyId = 2, Name = "Dr. Hakan Vural", Role = ColonistRole.Commander, Health = 98, Morale = 95, Stamina = 90, BuildingId = 8 };
            var c8 = new Colonist { Id = 8, ColonyId = 2, Name = "Zeynep Aksoy", Role = ColonistRole.Scientist, Health = 100, Morale = 92, Stamina = 95, BuildingId = 12 };
            var c9 = new Colonist { Id = 9, ColonyId = 2, Name = "Emre Çelik", Role = ColonistRole.Engineer, Health = 92, Morale = 88, Stamina = 85, BuildingId = 7 };
            var c10 = new Colonist { Id = 10, ColonyId = 2, Name = "Nil Yıldız", Role = ColonistRole.Doctor, Health = 96, Morale = 94, Stamina = 92, BuildingId = 8 };
            var c11 = new Colonist { Id = 11, ColonyId = 2, Name = "Barış Koç", Role = ColonistRole.Miner, Health = 89, Morale = 85, Stamina = 88, BuildingId = 11 };
            var c12 = new Colonist { Id = 12, ColonyId = 2, Name = "Selin Güneş", Role = ColonistRole.Biologist, Health = 94, Morale = 91, Stamina = 90, BuildingId = 9 };
            var c13 = new Colonist { Id = 13, ColonyId = 2, Name = "Onur Tekin", Role = ColonistRole.Technician, Health = 91, Morale = 86, Stamina = 87, BuildingId = 10 };
            var c14 = new Colonist { Id = 14, ColonyId = 2, Name = "Derya Uçar", Role = ColonistRole.Scientist, Health = 97, Morale = 93, Stamina = 91, BuildingId = 12 };
            var c15 = new Colonist { Id = 15, ColonyId = 2, Name = "Ali Toprak", Role = ColonistRole.Biologist, Health = 93, Morale = 89, Stamina = 90, BuildingId = 9 };
            var c16 = new Colonist { Id = 16, ColonyId = 2, Name = "Ceren Bulut", Role = ColonistRole.Engineer, Health = 95, Morale = 90, Stamina = 93, BuildingId = 7 };
            var c17 = new Colonist { Id = 17, ColonyId = 2, Name = "Kuzey Erdoğan", Role = ColonistRole.Miner, Health = 88, Morale = 82, Stamina = 85, BuildingId = 11 };
            var c18 = new Colonist { Id = 18, ColonyId = 2, Name = "Melis Aslan", Role = ColonistRole.Technician, Health = 92, Morale = 87, Stamina = 89, BuildingId = 10 };
            context.Colonists.AddRange(c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18);

            var m5 = new ExplorationMission
            {
                Id = 5, ColonyId = 2, Name = "Olympus Kalderası Krater Keşfi", TargetZone = "Kaldera Doğu Kenarı",
                Description = "Güneş sisteminin en büyük volkanik kraterinde jeotermal aktivite haritalanacak.",
                RiskLevel = MissionRiskLevel.Medium, Status = MissionStatus.Available, DurationInSols = 2, RemainingSols = 2,
                EnergyCost = 60, WaterCost = 15, CreditsCost = 250, RewardMinerals = 450, RewardWater = 120, RewardCredits = 600,
                RewardDescription = "+450 Maden, +120 Su, +600 Kredi"
            };
            var m6 = new ExplorationMission
            {
                Id = 6, ColonyId = 2, Name = "Lav Tüpü Derin Sondaj Taraması", TargetZone = "Sektör V-3",
                Description = "Derin volkanik tüplerde nadir kristalize mineraller aranacak.",
                RiskLevel = MissionRiskLevel.High, Status = MissionStatus.Available, DurationInSols = 3, RemainingSols = 3,
                EnergyCost = 100, WaterCost = 30, CreditsCost = 600, RewardMinerals = 800, RewardWater = 200, RewardCredits = 2500,
                RewardDescription = "+800 Maden, +200 Su, +2500 Kredi"
            };
            context.ExplorationMissions.AddRange(m5, m6);

            var ev3 = new ColonyEvent
            {
                Id = 3, ColonyId = 2, Sol = 142, Title = "Olympus İstasyonu İrtifa Başarısı",
                Message = "Olympus Mons zirvesindeki istasyon atmosferik filtreleme ve jeotermal jeneratörlerini başarıyla devreye aldı.",
                Type = EventType.Success, IsActive = false
            };
            context.ColonyEvents.Add(ev3);

            context.SaveChanges();
        }

        if (!context.Colonies.Any(c => c.Id == 3))
        {
            var colony3 = new Colony
            {
                Id = 3,
                Name = "Arcadia Base",
                Description = "Arcadia Planitia buzlu ovalarında kurulu su ve tarımsal genişleme kolonisi.",
                Commander = "Sarah Connor",
                Planet = "Mars",
                Location = "Arcadia Planitia",
                LastActiveDate = DateTime.UtcNow.AddMinutes(-20),
                Stats = new ColonyStats
                {
                    Sol = 85,
                    Population = 8,
                    MaxPopulation = 20,
                    Power = 220,
                    MaxPower = 300,
                    Water = 95,
                    MaxWater = 100,
                    Oxygen = 92,
                    MaxOxygen = 100,
                    Food = 310,
                    MaxFood = 500,
                    Minerals = 1950,
                    Credits = 32000,
                    SafetyScore = 98
                }
            };
            context.Colonies.Add(colony3);
            context.SaveChanges();

            var b13 = new Building { Id = 13, ColonyId = 3, Name = "Arcadia Kutup Güneş Santrali", BuildingType = BuildingType.SolarPanel, Level = 2, Health = 94, Workers = 1, MaxWorkers = 6, PowerConsumption = 0, PowerProduction = 280, IsActive = true };
            var b14 = new Building { Id = 14, ColonyId = 3, Name = "Arcadia Yaşam Modülü Alpha", BuildingType = BuildingType.Habitat, Level = 2, Health = 96, Workers = 1, MaxWorkers = 10, PowerConsumption = 20, PowerProduction = 0, IsActive = true };
            var b15 = new Building { Id = 15, ColonyId = 3, Name = "Yeraltı Biyosfer Serası", BuildingType = BuildingType.Greenhouse, Level = 2, Health = 90, Workers = 2, MaxWorkers = 5, PowerConsumption = 25, PowerProduction = 0, IsActive = true };
            var b16 = new Building { Id = 16, ColonyId = 3, Name = "Arcadia Buz Sondaj Kulesi", BuildingType = BuildingType.WaterExtractor, Level = 3, Health = 98, Workers = 2, MaxWorkers = 6, PowerConsumption = 30, PowerProduction = 0, IsActive = true };
            var b17 = new Building { Id = 17, ColonyId = 3, Name = "Buz Altı Metal Maden Ocağı", BuildingType = BuildingType.Mine, Level = 2, Health = 87, Workers = 1, MaxWorkers = 5, PowerConsumption = 35, PowerProduction = 0, IsActive = true };
            var b18 = new Building { Id = 18, ColonyId = 3, Name = "Kriyosfer Araştırma Laboratuvarı", BuildingType = BuildingType.ResearchLab, Level = 2, Health = 95, Workers = 1, MaxWorkers = 4, PowerConsumption = 35, PowerProduction = 0, IsActive = true };
            context.Buildings.AddRange(b13, b14, b15, b16, b17, b18);

            var c19 = new Colonist { Id = 19, ColonyId = 3, Name = "Sarah Connor", Role = ColonistRole.Commander, Health = 100, Morale = 95, Stamina = 95, BuildingId = 14 };
            var c20 = new Colonist { Id = 20, ColonyId = 3, Name = "Mehmet Yılmaz", Role = ColonistRole.Technician, Health = 94, Morale = 90, Stamina = 92, BuildingId = 16 };
            var c21 = new Colonist { Id = 21, ColonyId = 3, Name = "Gizem Çelik", Role = ColonistRole.Scientist, Health = 98, Morale = 92, Stamina = 90, BuildingId = 18 };
            var c22 = new Colonist { Id = 22, ColonyId = 3, Name = "Burak Demir", Role = ColonistRole.Engineer, Health = 90, Morale = 88, Stamina = 85, BuildingId = 13 };
            var c23 = new Colonist { Id = 23, ColonyId = 3, Name = "Elif Kaya", Role = ColonistRole.Biologist, Health = 96, Morale = 93, Stamina = 92, BuildingId = 15 };
            var c24 = new Colonist { Id = 24, ColonyId = 3, Name = "Tarık Aras", Role = ColonistRole.Miner, Health = 91, Morale = 86, Stamina = 89, BuildingId = 17 };
            var c25 = new Colonist { Id = 25, ColonyId = 3, Name = "Seda Güler", Role = ColonistRole.Doctor, Health = 97, Morale = 95, Stamina = 94, BuildingId = 14 };
            var c26 = new Colonist { Id = 26, ColonyId = 3, Name = "Oğuzhan Kurt", Role = ColonistRole.Technician, Health = 93, Morale = 89, Stamina = 90, BuildingId = 16 };
            context.Colonists.AddRange(c19, c20, c21, c22, c23, c24, c25, c26);

            var m7 = new ExplorationMission
            {
                Id = 7, ColonyId = 3, Name = "Kuzey Buzul Ovası Taraması", TargetZone = "Arcadia Planitia Batı",
                Description = "Kuzey ovalarındaki yüzey altı temiz buzul katmanları haritalanacak.",
                RiskLevel = MissionRiskLevel.Low, Status = MissionStatus.Available, DurationInSols = 2, RemainingSols = 2,
                EnergyCost = 40, WaterCost = 10, CreditsCost = 150, RewardMinerals = 200, RewardWater = 350, RewardCredits = 300,
                RewardDescription = "+200 Maden, +350 Su, +300 Kredi"
            };
            var m8 = new ExplorationMission
            {
                Id = 8, ColonyId = 3, Name = "Karasal Krater Yeraltı Suyu Araştırması", TargetZone = "Krater K-12",
                Description = "Krater havzasındaki mineralli tuzlu su kaynakları sondajlanacak.",
                RiskLevel = MissionRiskLevel.Medium, Status = MissionStatus.Available, DurationInSols = 3, RemainingSols = 3,
                EnergyCost = 70, WaterCost = 20, CreditsCost = 350, RewardMinerals = 400, RewardWater = 500, RewardCredits = 750,
                RewardDescription = "+400 Maden, +500 Su, +750 Kredi"
            };
            context.ExplorationMissions.AddRange(m7, m8);

            var ev4 = new ColonyEvent
            {
                Id = 4, ColonyId = 3, Sol = 85, Title = "Arcadia Planitia Su Üretimi",
                Message = "Arcadia üssü derin buzul sondajı ile günlük 120 L saf içilebilir su çıkarma hedefine ulaştı.",
                Type = EventType.Success, IsActive = false
            };
            context.ColonyEvents.Add(ev4);

            context.SaveChanges();
        }
    }
}
