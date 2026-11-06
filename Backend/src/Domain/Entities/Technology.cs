using Core.Persistence.Repositories;
using Domain.Enums;

namespace Domain.Entities;

public class Technology : Entity<int>
{
    public int ColonyId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ResearchCategory Category { get; set; }
    public decimal MineralCost { get; set; }
    public decimal CreditCost { get; set; }
    public int DurationInSols { get; set; } // Tamamlanması gereken Sol süresi
    public decimal Progress { get; set; } // 0 - 100 arası yüzde
    public ResearchStatus Status { get; set; }
    public string? PrerequisiteCode { get; set; } // Ön koşul teknolojinin kodu
    public ResearchBonusType BonusType { get; set; }
    public decimal BonusValue { get; set; } // Yüzdelik etki (örn: 20 => +%20)

    // Navigation Property
    public virtual Colony? Colony { get; set; }

    public Technology()
    {
        DurationInSols = 2;
        Progress = 0;
        Status = ResearchStatus.Available;
    }

    public Technology(
        int colonyId,
        string code,
        string name,
        string description,
        ResearchCategory category,
        decimal mineralCost,
        decimal creditCost,
        int durationInSols,
        decimal progress,
        ResearchStatus status,
        string? prerequisiteCode,
        ResearchBonusType bonusType,
        decimal bonusValue
    )
    {
        ColonyId = colonyId;
        Code = code;
        Name = name;
        Description = description;
        Category = category;
        MineralCost = mineralCost;
        CreditCost = creditCost;
        DurationInSols = durationInSols;
        Progress = progress;
        Status = status;
        PrerequisiteCode = prerequisiteCode;
        BonusType = bonusType;
        BonusValue = bonusValue;
    }

    public Technology(
        int id,
        int colonyId,
        string code,
        string name,
        string description,
        ResearchCategory category,
        decimal mineralCost,
        decimal creditCost,
        int durationInSols,
        decimal progress,
        ResearchStatus status,
        string? prerequisiteCode,
        ResearchBonusType bonusType,
        decimal bonusValue
    ) : base(id)
    {
        ColonyId = colonyId;
        Code = code;
        Name = name;
        Description = description;
        Category = category;
        MineralCost = mineralCost;
        CreditCost = creditCost;
        DurationInSols = durationInSols;
        Progress = progress;
        Status = status;
        PrerequisiteCode = prerequisiteCode;
        BonusType = bonusType;
        BonusValue = bonusValue;
    }
}
