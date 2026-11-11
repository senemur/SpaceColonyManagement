namespace Application.Features.Exploration.Queries.GetMissionsByColonyId;

using Domain.Entities;
using Domain.Enums;

public class ExplorationMissionDto
{
    public int Id { get; set; }
    public int ColonyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string TargetZone { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public MissionRiskLevel RiskLevel { get; set; }
    public string RiskLevelName { get; set; } = string.Empty;
    public MissionStatus Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public int DurationInSols { get; set; }
    public int RemainingSols { get; set; }
    public decimal EnergyCost { get; set; }
    public decimal WaterCost { get; set; }
    public decimal CreditsCost { get; set; }
    public decimal RewardMinerals { get; set; }
    public decimal RewardWater { get; set; }
    public decimal RewardCredits { get; set; }
    public string RewardDescription { get; set; } = string.Empty;
    public string? ResultSummary { get; set; }
    public int? StartSol { get; set; }
    public int? CompletedSol { get; set; }

    public static ExplorationMissionDto FromEntity(ExplorationMission mission)
    {
        return new ExplorationMissionDto
        {
            Id = mission.Id,
            ColonyId = mission.ColonyId,
            Name = mission.Name,
            TargetZone = mission.TargetZone,
            Description = mission.Description,
            RiskLevel = mission.RiskLevel,
            RiskLevelName = mission.RiskLevel switch
            {
                MissionRiskLevel.Low => "Düşük",
                MissionRiskLevel.Medium => "Orta",
                MissionRiskLevel.High => "Yüksek",
                _ => mission.RiskLevel.ToString()
            },
            Status = mission.Status,
            StatusName = mission.Status switch
            {
                MissionStatus.Available => "Hazır",
                MissionStatus.InProgress => "Devam Ediyor",
                MissionStatus.Completed => "Tamamlandı",
                MissionStatus.Failed => "Başarısız",
                _ => mission.Status.ToString()
            },
            DurationInSols = mission.DurationInSols,
            RemainingSols = mission.RemainingSols,
            EnergyCost = mission.EnergyCost,
            WaterCost = mission.WaterCost,
            CreditsCost = mission.CreditsCost,
            RewardMinerals = mission.RewardMinerals,
            RewardWater = mission.RewardWater,
            RewardCredits = mission.RewardCredits,
            RewardDescription = mission.RewardDescription,
            ResultSummary = mission.ResultSummary,
            StartSol = mission.StartSol,
            CompletedSol = mission.CompletedSol
        };
    }
}
