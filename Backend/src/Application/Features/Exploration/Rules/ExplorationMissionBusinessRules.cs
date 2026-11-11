namespace Application.Features.Exploration.Rules;

using Application.Services.Repositories;
using Core.Application.Rules;
using Core.CrossCuttingConcerns.Exception.Types;
using Domain.Entities;
using Domain.Enums;

public class ExplorationMissionBusinessRules(
    IExplorationMissionRepository explorationMissionRepository
) : BaseBusinessRules
{
    public Task MissionShouldExist(ExplorationMission? mission)
    {
        if (mission == null)
            throw new BusinessException("Keşif görevi bulunamadı.");
        return Task.CompletedTask;
    }

    public async Task MissionShouldExist(int id, CancellationToken cancellationToken = default)
    {
        bool doesExists = await explorationMissionRepository.AnyAsync(
            predicate: m => m.Id == id,
            cancellationToken: cancellationToken
        );
        if (!doesExists)
            throw new BusinessException("Keşif görevi bulunamadı.");
    }

    public Task MissionShouldBeAvailableToStart(ExplorationMission mission)
    {
        if (mission.Status != MissionStatus.Available)
            throw new BusinessException($"Bu görev şu anda başlatılamaz. Mevcut durum: {mission.Status}");
        return Task.CompletedTask;
    }

    public Task ColonyShouldHaveSufficientResources(Colony colony, ExplorationMission mission)
    {
        var stats = colony.Stats;
        if (stats.Power < mission.EnergyCost)
            throw new BusinessException($"Yetersiz Güç! Bu görev için {mission.EnergyCost} kW güç gerekiyor, mevcut: {stats.Power:0} kW.");

        if (stats.Water < mission.WaterCost)
            throw new BusinessException($"Yetersiz Su! Bu görev için {mission.WaterCost} L su gerekiyor, mevcut: {stats.Water:0} L.");

        if (stats.Credits < mission.CreditsCost)
            throw new BusinessException($"Yetersiz Kredi! Bu görev için {mission.CreditsCost:0} ₺ bütçe gerekiyor, mevcut: {stats.Credits:0} ₺.");

        return Task.CompletedTask;
    }
}
