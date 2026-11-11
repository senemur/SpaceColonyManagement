namespace Application.Features.Colonies.Commands.ProcessOfflineProgress;

using Application.Features.Colonies.Rules;
using Application.Services.Repositories;
using Domain.Entities;
using Domain.Enums;
using MediatR;

public class ProcessOfflineProgressCommand : IRequest<OfflineProgressResponse>
{
    public int ColonyId { get; set; } = 1;

    public class ProcessOfflineProgressCommandHandler(
        IColonyRepository colonyRepository,
        IBuildingRepository buildingRepository,
        IColonistRepository colonistRepository,
        ITechnologyRepository technologyRepository,
        IColonyEventRepository colonyEventRepository,
        IExplorationMissionRepository explorationMissionRepository,
        ColonyBusinessRules colonyBusinessRules
    ) : IRequestHandler<ProcessOfflineProgressCommand, OfflineProgressResponse>
    {
        public async Task<OfflineProgressResponse> Handle(
            ProcessOfflineProgressCommand request,
            CancellationToken cancellationToken
        )
        {
            var colony = await colonyRepository.GetAsync(
                predicate: c => c.Id == request.ColonyId,
                cancellationToken: cancellationToken
            );
            await colonyBusinessRules.ColonyShouldExistWhenRequested(colony);

            var now = DateTime.UtcNow;
            var lastActive = colony!.LastActiveDate == default ? now.AddMinutes(-10) : colony.LastActiveDate;
            var elapsed = now - lastActive;
            double totalMinutes = Math.Max(0, elapsed.TotalMinutes);

            var response = new OfflineProgressResponse
            {
                LastActiveDate = lastActive,
                CurrentSyncDate = now,
                ElapsedMinutes = Math.Round(totalMinutes, 1)
            };

            // 1 dakikadan az ise çevrimdışı işlem yapma
            if (totalMinutes < 1.0)
            {
                response.HasProgress = false;
                response.SummaryMessage = "Son ziyaretten bu yana yeterli süre geçmedi.";
                colony.LastActiveDate = now;
                await colonyRepository.UpdateAsync(colony);
                return response;
            }

            // Maksimum 24 saat (1440 dk) çevrimdışı birikim sınırı
            double effectiveMinutes = Math.Min(totalMinutes, 1440.0);
            decimal solFactor = (decimal)(effectiveMinutes / 15.0); // Her 15 gerçek dakika = 1 Sol simülasyonu
            int solsAdvanced = (int)(effectiveMinutes / 15.0);

            var buildingsData = await buildingRepository.GetListAsync(
                predicate: b => b.ColonyId == request.ColonyId,
                size: 100,
                cancellationToken: cancellationToken
            );
            var buildings = buildingsData.Items.Where(b => b.IsActive).ToList();

            var colonistsData = await colonistRepository.GetListAsync(
                predicate: c => c.ColonyId == request.ColonyId,
                size: 200,
                cancellationToken: cancellationToken
            );
            var colonists = colonistsData.Items.ToList();

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

            var activeMissionsData = await explorationMissionRepository.GetListAsync(
                predicate: m => m.ColonyId == request.ColonyId && m.Status == MissionStatus.InProgress,
                size: 20,
                cancellationToken: cancellationToken
            );
            var activeMissions = activeMissionsData.Items.ToList();

            var stats = colony.Stats;
            decimal prevPower = stats.Power;
            decimal prevWater = stats.Water;
            decimal prevFood = stats.Food;
            decimal prevOxygen = stats.Oxygen;
            decimal prevMinerals = stats.Minerals;

            // Teknoloji ve Olay Bonusları
            var completedTechs = technologies.Where(t => t.Status == ResearchStatus.Completed).ToList();
            decimal techPowerBonus = completedTechs.Where(t => t.BonusType == ResearchBonusType.PowerProduction).Sum(t => t.BonusValue);
            decimal techFoodBonus = completedTechs.Where(t => t.BonusType == ResearchBonusType.FoodProduction).Sum(t => t.BonusValue);
            decimal techWaterBonus = completedTechs.Where(t => t.BonusType == ResearchBonusType.WaterProduction).Sum(t => t.BonusValue);
            decimal techMineralBonus = completedTechs.Where(t => t.BonusType == ResearchBonusType.MineralProduction).Sum(t => t.BonusValue);
            decimal techOxygenBonus = completedTechs.Where(t => t.BonusType == ResearchBonusType.OxygenProduction).Sum(t => t.BonusValue);

            decimal eventPowerModifier = activeEvents.Where(e => e.IsActive && e.EffectType == EventEffectType.PowerProductionModifier).Sum(e => e.EffectValue);
            decimal eventFoodModifier = activeEvents.Where(e => e.IsActive && e.EffectType == EventEffectType.FoodProductionModifier).Sum(e => e.EffectValue);
            decimal eventWaterModifier = activeEvents.Where(e => e.IsActive && e.EffectType == EventEffectType.WaterProductionModifier).Sum(e => e.EffectValue);

            decimal powerMultiplier = Math.Max(0.1m, 1m + ((techPowerBonus + eventPowerModifier) / 100m));
            decimal foodMultiplier = Math.Max(0.1m, 1m + ((techFoodBonus + eventFoodModifier) / 100m));
            decimal waterMultiplier = Math.Max(0.1m, 1m + ((techWaterBonus + eventWaterModifier) / 100m));
            decimal mineralMultiplier = Math.Max(0.1m, 1m + (techMineralBonus / 100m));
            decimal oxygenMultiplier = Math.Max(0.1m, 1m + (techOxygenBonus / 100m));

            // Sol Başına Üretim/Tüketim Oranları
            decimal totalPowerProduced = buildings.Sum(b => (decimal)b.PowerProduction) * powerMultiplier;
            decimal totalPowerConsumed = buildings.Sum(b => (decimal)b.PowerConsumption);
            bool hasPower = stats.Power > 0 || totalPowerProduced >= totalPowerConsumed;

            decimal waterProduced = 0;
            decimal foodProduced = 0;
            decimal mineralsProduced = 0;
            decimal waterConsumedByFarms = 0;

            if (hasPower)
            {
                foreach (var b in buildings)
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

            int colonistCount = colonists.Count;
            decimal dailyWaterNeeded = colonistCount * 2;
            decimal dailyFoodNeeded = colonistCount * 2;
            decimal dailyOxygenNeeded = colonistCount * 1;
            int activeHabitats = buildings.Count(b => b.BuildingType == BuildingType.Habitat);
            decimal dailyOxygenProduced = (activeHabitats * 15) * oxygenMultiplier;

            // Çevrimdışı geçen süre katsayısıyla net değişimleri uygula
            stats.Power = Math.Clamp(stats.Power + ((totalPowerProduced - totalPowerConsumed) * solFactor), 0, stats.MaxPower);
            stats.Water = Math.Clamp(stats.Water + ((waterProduced - waterConsumedByFarms - dailyWaterNeeded) * solFactor), 0, stats.MaxWater);
            stats.Food = Math.Clamp(stats.Food + ((foodProduced - dailyFoodNeeded) * solFactor), 0, stats.MaxFood);
            stats.Minerals = Math.Max(0, stats.Minerals + (mineralsProduced * solFactor));
            stats.Oxygen = Math.Clamp(stats.Oxygen + ((dailyOxygenProduced - dailyOxygenNeeded) * solFactor), 0, stats.MaxOxygen);

            // Sol ve Olay Süreleri İlerlemesi
            if (solsAdvanced > 0)
            {
                stats.Sol += solsAdvanced;
                response.SolsAdvanced = solsAdvanced;
                response.Details.Add($"Mars takviminde {solsAdvanced} Sol geride bırakıldı.");

                foreach (var activeEvent in activeEvents.ToList())
                {
                    activeEvent.RemainingSols -= solsAdvanced;
                    if (activeEvent.RemainingSols <= 0)
                    {
                        activeEvent.RemainingSols = 0;
                        activeEvent.IsActive = false;
                        await colonyEventRepository.UpdateAsync(activeEvent);

                        var resolvedEvent = new ColonyEvent(
                            colonyId: request.ColonyId,
                            sol: stats.Sol,
                            title: $"{activeEvent.Title} Tamamlandı",
                            message: "Çevrimdışı geçen sürede olay sona erdi.",
                            type: EventType.Info
                        );
                        await colonyEventRepository.AddAsync(resolvedEvent);
                        response.Details.Add($"'{activeEvent.Title}' olayı sona erdi.");
                    }
                    else
                    {
                        await colonyEventRepository.UpdateAsync(activeEvent);
                    }
                }

                // Aktif Araştırma İlerlemesi
                var activeResearch = technologies.FirstOrDefault(t => t.Status == ResearchStatus.InProgress);
                if (activeResearch != null)
                {
                    int researchLabs = buildings.Count(b => b.BuildingType == BuildingType.ResearchLab);
                    decimal baseProgress = (100m / Math.Max(1, activeResearch.DurationInSols)) * solsAdvanced;
                    decimal labMultiplier = 1m + (researchLabs * 0.15m);
                    activeResearch.Progress = Math.Min(100m, activeResearch.Progress + (baseProgress * labMultiplier));

                    if (activeResearch.Progress >= 100m)
                    {
                        activeResearch.Status = ResearchStatus.Completed;
                        response.Details.Add($"Bilimsel araştırma tamamlandı: {activeResearch.Name}!");
                    }
                    await technologyRepository.UpdateAsync(activeResearch);
                }

                // Aktif Keşif Görevleri İlerlemesi
                foreach (var mission in activeMissions)
                {
                    mission.RemainingSols -= solsAdvanced;
                    if (mission.RemainingSols <= 0)
                    {
                        mission.RemainingSols = 0;
                        mission.CompletedSol = stats.Sol;
                        mission.Status = MissionStatus.Completed;
                        stats.Minerals += mission.RewardMinerals;
                        stats.Water = Math.Clamp(stats.Water + mission.RewardWater, 0, stats.MaxWater);
                        stats.Credits += mission.RewardCredits;
                        mission.ResultSummary = $"Çevrimdışı sürede keşif tamamlandı! {mission.RewardDescription} üsse ulaştı.";
                        response.Details.Add($"Keşif ekibi üsse döndü: '{mission.Name}' (+{mission.RewardMinerals} Maden, +{mission.RewardWater} Su).");
                    }
                    await explorationMissionRepository.UpdateAsync(mission);
                }
            }

            colony.LastActiveDate = now;
            await colonyRepository.UpdateAsync(colony);

            response.HasProgress = true;
            response.PowerChange = Math.Round(stats.Power - prevPower, 1);
            response.WaterChange = Math.Round(stats.Water - prevWater, 1);
            response.FoodChange = Math.Round(stats.Food - prevFood, 1);
            response.OxygenChange = Math.Round(stats.Oxygen - prevOxygen, 1);
            response.MineralsChange = Math.Round(stats.Minerals - prevMinerals, 1);

            int hours = (int)(effectiveMinutes / 60);
            int mins = (int)(effectiveMinutes % 60);
            string timeStr = hours > 0 ? $"{hours} sa {mins} dk" : $"{mins} dk";
            response.SummaryMessage = $"Yokluğunuzda Mars'ta {timeStr} geçti. Koloni sistemleri arka planda çalışmayı sürdürdü.";

            return response;
        }
    }
}
