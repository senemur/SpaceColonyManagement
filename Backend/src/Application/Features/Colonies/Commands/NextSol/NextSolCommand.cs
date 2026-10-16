namespace Application.Features.Colonies.Commands.NextSol;

using Application.Features.Colonies.Rules;
using Application.Services.Repositories;
using Core.CrossCuttingConcerns.Exception.Types;
using Domain.Entities;
using Domain.Enums;
using MediatR;

public class NextSolCommand : IRequest<NextSolResponse>
{
    public int ColonyId { get; set; } = 1;

    public class NextSolCommandHandler(
        IColonyRepository colonyRepository,
        IBuildingRepository buildingRepository,
        IColonistRepository colonistRepository,
        ColonyBusinessRules colonyBusinessRules
    ) : IRequestHandler<NextSolCommand, NextSolResponse>
    {
        public async Task<NextSolResponse> Handle(
            NextSolCommand request,
            CancellationToken cancellationToken
        )
        {
            // 1. Koloniyi çek
            Colony? colony = await colonyRepository.GetAsync(
                predicate: c => c.Id == request.ColonyId,
                cancellationToken: cancellationToken
            );
            await colonyBusinessRules.ColonyShouldExistWhenRequested(colony);

            // 2. Koloninin binalarını ve kolonistlerini çek
            var buildingsData = await buildingRepository.GetListAsync(
                predicate: b => b.ColonyId == request.ColonyId,
                size: 100,
                cancellationToken: cancellationToken
            );
            var buildings = buildingsData.Items;

            var colonistsData = await colonistRepository.GetListAsync(
                predicate: c => c.ColonyId == request.ColonyId,
                size: 200,
                cancellationToken: cancellationToken
            );
            var colonists = colonistsData.Items;

            var response = new NextSolResponse();
            var stats = colony!.Stats;

            // Gün sayacını artır
            stats.Sol += 1;
            response.Sol = stats.Sol;
            response.LogMessages.Add($"Sol {stats.Sol} başladı. Güneş panelleri ve üretim üniteleri kalibre ediliyor.");

            // 3. ENERJİ HESAPLAMASI
            var activeBuildings = buildings.Where(b => b.IsActive).ToList();
            decimal totalPowerProduced = activeBuildings.Sum(b => (decimal)b.PowerProduction);
            decimal totalPowerConsumed = activeBuildings.Sum(b => (decimal)b.PowerConsumption);

            response.PowerProduced = totalPowerProduced;
            response.PowerConsumed = totalPowerConsumed;

            stats.Power += (totalPowerProduced - totalPowerConsumed);
            if (stats.Power > stats.MaxPower) stats.Power = stats.MaxPower;
            if (stats.Power < 0)
            {
                stats.Power = 0;
                response.LogMessages.Add("UYARI: Koloni güç şebekesi çöktü! Yetersiz enerji üretimi.");
            }

            bool hasPower = stats.Power > 0 || totalPowerProduced >= totalPowerConsumed;

            // 4. BİNA ÜRETİMLERİ (Enerji varsa çalışırlar)
            decimal waterProduced = 0;
            decimal foodProduced = 0;
            decimal mineralsProduced = 0;
            decimal waterConsumedByFarms = 0;

            if (hasPower)
            {
                foreach (var b in activeBuildings)
                {
                    switch (b.BuildingType)
                    {
                        case BuildingType.WaterExtractor:
                            waterProduced += (25 * b.Level);
                            break;

                        case BuildingType.Greenhouse:
                            if (b.Workers > 0 && stats.Water >= (5 * b.Workers))
                            {
                                foodProduced += (15 * b.Workers * b.Level);
                                waterConsumedByFarms += (5 * b.Workers);
                            }
                            break;

                        case BuildingType.Mine:
                            if (b.Workers > 0)
                            {
                                mineralsProduced += (10 * b.Workers * b.Level);
                            }
                            break;
                    }
                }
            }

            stats.Water += waterProduced - waterConsumedByFarms;
            stats.Food += foodProduced;
            stats.Minerals += mineralsProduced;

            response.WaterProduced = waterProduced;
            response.FoodProduced = foodProduced;
            response.MineralsProduced = mineralsProduced;

            // 5. MÜRETTEBAT TÜKETİMİ & SAĞLIK/STAMINA
            int colonistCount = colonists.Count;
            response.ActiveColonists = colonistCount;
            response.WorkingColonists = colonists.Count(c => c.IsAssigned);
            response.IdleColonists = colonists.Count(c => !c.IsAssigned);

            // Günlük kişi başı tüketim
            decimal dailyWaterNeeded = colonistCount * 2;
            decimal dailyFoodNeeded = colonistCount * 2;
            decimal dailyOxygenNeeded = colonistCount * 1;

            response.WaterConsumed = dailyWaterNeeded + waterConsumedByFarms;
            response.FoodConsumed = dailyFoodNeeded;

            stats.Water -= dailyWaterNeeded;
            stats.Food -= dailyFoodNeeded;
            stats.Oxygen -= dailyOxygenNeeded;

            // Oksijen üretimi (Habitatlar aktifse oksijen dengelenir)
            int activeHabitats = activeBuildings.Count(b => b.BuildingType == BuildingType.Habitat);
            stats.Oxygen += (activeHabitats * 15);
            if (stats.Oxygen > stats.MaxOxygen) stats.Oxygen = stats.MaxOxygen;
            if (stats.Water > stats.MaxWater) stats.Water = stats.MaxWater;
            if (stats.Food > stats.MaxFood) stats.Food = stats.MaxFood;

            // Kaynak tükenme durumları & Kolonist sağlığı/stamina güncellemesi
            bool isStarving = stats.Food <= 0;
            bool isDehydrated = stats.Water <= 0;
            bool isSuffocating = stats.Oxygen <= 0;

            if (stats.Food < 0) stats.Food = 0;
            if (stats.Water < 0) stats.Water = 0;
            if (stats.Oxygen < 0) stats.Oxygen = 0;

            if (isSuffocating) response.LogMessages.Add("KRİTİK ALARM: Oksijen rezervleri tükendi! Mürettebat boğulma tehlikesinde!");
            if (isDehydrated) response.LogMessages.Add("UYARI: Su bitti! Kolonistler susuzluk çekiyor.");
            if (isStarving) response.LogMessages.Add("UYARI: Besin stokları boşaldı! Açlık baş gösterdi.");

            foreach (var colonist in colonists)
            {
                // Sağlık ve Moral Etkileri
                if (isSuffocating) colonist.Health = Math.Max(0, colonist.Health - 30);
                else if (isDehydrated) colonist.Health = Math.Max(0, colonist.Health - 15);
                else if (isStarving) colonist.Health = Math.Max(0, colonist.Health - 10);
                else
                {
                    // Kaynaklar tamsa iyileşme
                    colonist.Health = Math.Min(100, colonist.Health + 5);
                    colonist.Morale = Math.Min(100, colonist.Morale + 5);
                }

                // Stamina Dinamiği: Çalışan yorulur, boşta olan dinlenir
                if (colonist.IsAssigned)
                {
                    colonist.Stamina = Math.Max(0, colonist.Stamina - 15);
                    if (colonist.Stamina == 0)
                    {
                        colonist.Morale = Math.Max(0, colonist.Morale - 10);
                    }
                }
                else
                {
                    colonist.Stamina = Math.Min(100, colonist.Stamina + 25);
                }

                await colonistRepository.UpdateAsync(colonist);
            }

            // Nüfus ve Güvenlik Skoru
            stats.Population = colonists.Count(c => c.Health > 0);
            stats.SafetyScore = Math.Clamp(
                (int)((stats.Oxygen * 0.3m) + (stats.Water * 0.3m) + (stats.Power * 0.2m) + (colonists.Count > 0 ? colonists.Average(c => (decimal)c.Health) * 0.2m : 20m)),
                0,
                100
            );

            await colonyRepository.UpdateAsync(colony);

            if (foodProduced > 0) response.LogMessages.Add($"Hidroponik seralardan +{foodProduced} kg besin hasat edildi.");
            if (waterProduced > 0) response.LogMessages.Add($"Yeraltı buz tesislerinden +{waterProduced} L su çıkarıldı.");
            if (mineralsProduced > 0) response.LogMessages.Add($"Maden ocaklarından +{mineralsProduced} t metal ve mineral çıkarıldı.");

            return response;
        }
    }
}