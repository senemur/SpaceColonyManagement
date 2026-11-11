using Core.Persistence.Repositories;
using Domain.Enums;

namespace Domain.Entities;

public class ExplorationMission : Entity<int>
{
    public int ColonyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string TargetZone { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public MissionRiskLevel RiskLevel { get; set; }
    public MissionStatus Status { get; set; }
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

    // Navigation Property
    public virtual Colony? Colony { get; set; }

    public ExplorationMission()
    {
        RiskLevel = MissionRiskLevel.Low;
        Status = MissionStatus.Available;
        DurationInSols = 1;
        RemainingSols = 1;
    }

    public ExplorationMission(
        int colonyId,
        string name,
        string targetZone,
        string description,
        MissionRiskLevel riskLevel,
        int durationInSols,
        decimal energyCost,
        decimal waterCost,
        decimal creditsCost,
        decimal rewardMinerals,
        decimal rewardWater,
        decimal rewardCredits,
        string rewardDescription,
        MissionStatus status = MissionStatus.Available
    )
    {
        ColonyId = colonyId;
        Name = name;
        TargetZone = targetZone;
        Description = description;
        RiskLevel = riskLevel;
        Status = status;
        DurationInSols = durationInSols;
        RemainingSols = durationInSols;
        EnergyCost = energyCost;
        WaterCost = waterCost;
        CreditsCost = creditsCost;
        RewardMinerals = rewardMinerals;
        RewardWater = rewardWater;
        RewardCredits = rewardCredits;
        RewardDescription = rewardDescription;
    }

    public ExplorationMission(
        int id,
        int colonyId,
        string name,
        string targetZone,
        string description,
        MissionRiskLevel riskLevel,
        int durationInSols,
        decimal energyCost,
        decimal waterCost,
        decimal creditsCost,
        decimal rewardMinerals,
        decimal rewardWater,
        decimal rewardCredits,
        string rewardDescription,
        MissionStatus status = MissionStatus.Available
    ) : this(
        colonyId,
        name,
        targetZone,
        description,
        riskLevel,
        durationInSols,
        energyCost,
        waterCost,
        creditsCost,
        rewardMinerals,
        rewardWater,
        rewardCredits,
        rewardDescription,
        status
    )
    {
        Id = id;
    }
}
