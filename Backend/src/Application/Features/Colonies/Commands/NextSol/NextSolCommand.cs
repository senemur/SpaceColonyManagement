namespace Application.Features.Colonies.Commands.NextSol;

using Application.Features.Colonies.Rules;
using Application.Features.Events.Constants;
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
        ITechnologyRepository technologyRepository,
        IColonyEventRepository colonyEventRepository,
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

            // 2. Koloninin binalarını, kolonistlerini, araştırmalarını ve aktif olaylarını çek
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

            var techsData = await technologyRepository.GetListAsync(
                predicate: t => t.ColonyId == request.ColonyId,
                size: 50,
                cancellationToken: cancellationToken
            );
            var technologies = techsData.Items.ToList();

            var activeEventsData = await colonyEventRepository.GetListAsync(
                predicate: e => e.ColonyId == request.ColonyId && e.IsActive,
                size: 50,
                cancellationToken: cancellationToken
            );
            var activeEvents = activeEventsData.Items.ToList();

            var response = new NextSolResponse();
            var stats = colony!.Stats;

            // Gün sayacını artır
            stats.Sol += 1;
            response.Sol = stats.Sol;
            response.LogMessages.Add($"Sol {stats.Sol} başladı. Güneş panelleri ve üretim üniteleri kalibre ediliyor.");

            var activeBuildings = buildings.Where(b => b.IsActive).ToList();

            // 3. SÜRELİ OLAYLARIN YÖNETİMİ (Sprint 8: Event duration & active events)
            foreach (var activeEvent in activeEvents.ToList())
            {
                activeEvent.RemainingSols -= 1;
                if (activeEvent.RemainingSols <= 0)
                {
                    activeEvent.IsActive = false;
                    await colonyEventRepository.UpdateAsync(activeEvent);
                    activeEvents.Remove(activeEvent);

                    response.LogMessages.Add($"🌤️ Etki Sona Erdi: '{activeEvent.Title}' tamamlandı. Sistemler normale döndü.");

                    var resolveEvent = new ColonyEvent(
                        colonyId: request.ColonyId,
                        sol: stats.Sol,
                        title: $"{activeEvent.Title} Sona Erdi",
                        message: "Mars yüzeyindeki olay süresi tamamlandı. Koloni operasyonları normal çalışma seyrine döndü.",
                        type: EventType.Info
                    );
                    await colonyEventRepository.AddAsync(resolveEvent);
                }
                else
                {
                    await colonyEventRepository.UpdateAsync(activeEvent);
                    response.LogMessages.Add($"⚠️ Devam Eden Olay: '{activeEvent.Title}' (Kalan Süre: {activeEvent.RemainingSols} Sol).");
                }
            }

            // 4. RASTGELE YENİ MARS OLAYI TETİKLEME (Sprint 8: Event generation)
            var newEvent = EventGenerator.TryGenerateRandomEvent(request.ColonyId, stats.Sol, activeEvents, colony);
            if (newEvent != null)
            {
                await colonyEventRepository.AddAsync(newEvent);
                response.LogMessages.Add($"📢 YENİ OLAY: {newEvent.Title} - {newEvent.Message}");

                if (newEvent.IsActive)
                {
                    activeEvents.Add(newEvent);
                }

                // Kolonist sağlığına anlık etki eden olaylar
                if (newEvent.EffectType == EventEffectType.ColonistHealthEffect)
                {
                    foreach (var colonist in colonists)
                    {
                        colonist.Health = Math.Clamp(colonist.Health + (int)newEvent.EffectValue, 10, 100);
                        colonist.Morale = Math.Clamp(colonist.Morale + (int)newEvent.EffectValue, 10, 100);
                        await colonistRepository.UpdateAsync(colonist);
                    }
                }
            }

            // 5. AKTİF ARAŞTIRMA İLERLEMESİ (Sprint 7: Research duration & progression)
            var activeResearch = technologies.FirstOrDefault(t => t.Status == ResearchStatus.InProgress);
            if (activeResearch != null)
            {
                int researchLabs = activeBuildings.Count(b => b.BuildingType == BuildingType.ResearchLab);
                int activeScientists = colonists.Count(c => c.Role == ColonistRole.Scientist && c.IsAssigned);

                decimal baseProgress = 100m / Math.Max(1, activeResearch.DurationInSols);
                decimal labMultiplier = 1m + (researchLabs * 0.15m) + (activeScientists * 0.05m);
                decimal progressIncrement = baseProgress * labMultiplier;

                activeResearch.Progress = Math.Min(100m, activeResearch.Progress + progressIncrement);

                if (activeResearch.Progress >= 100m)
                {
                    activeResearch.Progress = 100m;
                    activeResearch.Status = ResearchStatus.Completed;
                    await technologyRepository.UpdateAsync(activeResearch);

                    var unlockedTechs = technologies
                        .Where(t => t.Status == ResearchStatus.Locked && t.PrerequisiteCode == activeResearch.Code)
                        .ToList();

                    foreach (var unlocked in unlockedTechs)
                    {
                        unlocked.Status = ResearchStatus.Available;
                        await technologyRepository.UpdateAsync(unlocked);
                    }

                    response.LogMessages.Add(
                        $"🎉 BİLİMSEL BULUŞ: '{activeResearch.Name}' araştırması tamamlandı! " +
                        $"Etki: +%{activeResearch.BonusValue:0} {activeResearch.BonusType} bonusu devreye girdi."
                    );
                }
                else
                {
                    await technologyRepository.UpdateAsync(activeResearch);
                    response.LogMessages.Add(
                        $"🔬 Laboratuvar: '{activeResearch.Name}' araştırması sürüyor (%{activeResearch.Progress:0.0} tamamlandı)."
                    );
                }
            }

            // 6. BİLİMSEL BONUSLAR VE OLAY ETKİLERİNİN HESAPLANMASI
            var completedTechs = technologies.Where(t => t.Status == ResearchStatus.Completed).ToList();
            decimal techPowerBonus = completedTechs.Where(t => t.BonusType == ResearchBonusType.PowerProduction).Sum(t => t.BonusValue);
            decimal techFoodBonus = completedTechs.Where(t => t.BonusType == ResearchBonusType.FoodProduction).Sum(t => t.BonusValue);
            decimal techWaterBonus = completedTechs.Where(t => t.BonusType == ResearchBonusType.WaterProduction).Sum(t => t.BonusValue);
            decimal techMineralBonus = completedTechs.Where(t => t.BonusType == ResearchBonusType.MineralProduction).Sum(t => t.BonusValue);
            decimal techOxygenBonus = completedTechs.Where(t => t.BonusType == ResearchBonusType.OxygenProduction).Sum(t => t.BonusValue);

            // Aktif olayların üretim çarpanları (Sprint 8: Positive & Negative Event effects)
            decimal eventPowerModifier = activeEvents.Where(e => e.IsActive && e.EffectType == EventEffectType.PowerProductionModifier).Sum(e => e.EffectValue);
            decimal eventFoodModifier = activeEvents.Where(e => e.IsActive && e.EffectType == EventEffectType.FoodProductionModifier).Sum(e => e.EffectValue);
            decimal eventWaterModifier = activeEvents.Where(e => e.IsActive && e.EffectType == EventEffectType.WaterProductionModifier).Sum(e => e.EffectValue);

            decimal powerMultiplier = Math.Max(0.1m, 1m + ((techPowerBonus + eventPowerModifier) / 100m));
            decimal foodMultiplier = Math.Max(0.1m, 1m + ((techFoodBonus + eventFoodModifier) / 100m));
            decimal waterMultiplier = Math.Max(0.1m, 1m + ((techWaterBonus + eventWaterModifier) / 100m));
            decimal mineralMultiplier = Math.Max(0.1m, 1m + (techMineralBonus / 100m));
            decimal oxygenMultiplier = Math.Max(0.1m, 1m + (techOxygenBonus / 100m));

            // 7. ENERJİ HESAPLAMASI (Bonuslar ve Olaylar Dahil)
            decimal totalPowerProduced = activeBuildings.Sum(b => (decimal)b.PowerProduction) * powerMultiplier;
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

            // 8. BİNA ÜRETİMLERİ (Enerji varsa çalışırlar + Araştırma/Olay Bonusları)
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
                            waterProduced += (25 * b.Level) * waterMultiplier;
                            break;

                        case BuildingType.Greenhouse:
                            if (b.Workers > 0 && stats.Water >= (5 * b.Workers))
                            {
                                foodProduced += (15 * b.Workers * b.Level) * foodMultiplier;
                                waterConsumedByFarms += (5 * b.Workers);
                            }
                            break;

                        case BuildingType.Mine:
                            if (b.Workers > 0)
                            {
                                mineralsProduced += (10 * b.Workers * b.Level) * mineralMultiplier;
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

            // 9. MÜRETTEBAT TÜKETİMİ & SAĞLIK/STAMINA
            int colonistCount = colonists.Count;
            response.ActiveColonists = colonistCount;
            response.WorkingColonists = colonists.Count(c => c.IsAssigned);
            response.IdleColonists = colonists.Count(c => !c.IsAssigned);

            decimal dailyWaterNeeded = colonistCount * 2;
            decimal dailyFoodNeeded = colonistCount * 2;
            decimal dailyOxygenNeeded = colonistCount * 1;

            response.WaterConsumed = dailyWaterNeeded + waterConsumedByFarms;
            response.FoodConsumed = dailyFoodNeeded;

            stats.Water -= dailyWaterNeeded;
            stats.Food -= dailyFoodNeeded;
            stats.Oxygen -= dailyOxygenNeeded;

            int activeHabitats = activeBuildings.Count(b => b.BuildingType == BuildingType.Habitat);
            stats.Oxygen += (activeHabitats * 15) * oxygenMultiplier;

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
                if (isSuffocating) colonist.Health = Math.Max(0, colonist.Health - 30);
                else if (isDehydrated) colonist.Health = Math.Max(0, colonist.Health - 15);
                else if (isStarving) colonist.Health = Math.Max(0, colonist.Health - 10);
                else
                {
                    colonist.Health = Math.Min(100, colonist.Health + 5);
                    colonist.Morale = Math.Min(100, colonist.Morale + 5);
                }

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

            if (foodProduced > 0) response.LogMessages.Add($"Hidroponik seralardan +{foodProduced:0} kg besin hasat edildi.");
            if (waterProduced > 0) response.LogMessages.Add($"Yeraltı buz tesislerinden +{waterProduced:0} L su çıkarıldı.");
            if (mineralsProduced > 0) response.LogMessages.Add($"Maden ocaklarından +{mineralsProduced:0} t metal ve mineral çıkarıldı.");

            return response;
        }
    }
}
