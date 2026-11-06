namespace Application.Features.Research.Queries.GetTechTree;

using Domain.Entities;
using Domain.Enums;

public class TechnologyDto
{
    public int Id { get; set; }
    public int ColonyId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ResearchCategory Category { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public decimal MineralCost { get; set; }
    public decimal CreditCost { get; set; }
    public int DurationInSols { get; set; }
    public decimal Progress { get; set; }
    public ResearchStatus Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public string? PrerequisiteCode { get; set; }
    public string? PrerequisiteName { get; set; }
    public ResearchBonusType BonusType { get; set; }
    public string BonusTypeName { get; set; } = string.Empty;
    public decimal BonusValue { get; set; }
    public string BonusDescription { get; set; } = string.Empty;

    public static TechnologyDto FromEntity(Technology entity, List<Technology> allColonyTechs)
    {
        string categoryName = entity.Category switch
        {
            ResearchCategory.Agriculture => "Biyoloji & Tarım",
            ResearchCategory.Energy => "Enerji Sistemleri",
            ResearchCategory.Mining => "Madencilik",
            ResearchCategory.LifeSupport => "Yaşam Destek",
            ResearchCategory.Space => "Uzay",
            _ => entity.Category.ToString()
        };

        string statusName = entity.Status switch
        {
            ResearchStatus.Locked => "Kilitli",
            ResearchStatus.Available => "Başlatılabilir",
            ResearchStatus.InProgress => "Araştırılıyor",
            ResearchStatus.Completed => "Tamamlandı",
            _ => entity.Status.ToString()
        };

        string bonusTypeName = entity.BonusType switch
        {
            ResearchBonusType.FoodProduction => "Besin Üretimi",
            ResearchBonusType.WaterProduction => "Su Üretimi",
            ResearchBonusType.OxygenProduction => "Oksijen Üretimi",
            ResearchBonusType.PowerProduction => "Enerji Üretimi",
            ResearchBonusType.MineralProduction => "Maden Üretimi",
            ResearchBonusType.ConstructionDiscount => "İnşaat İndirimi",
            _ => entity.BonusType.ToString()
        };

        string bonusDescription = entity.BonusType == ResearchBonusType.ConstructionDiscount
            ? $"%{entity.BonusValue:0} İnşa İndirimi"
            : $"+%{entity.BonusValue:0} {bonusTypeName}";

        string? prerequisiteName = null;
        if (!string.IsNullOrEmpty(entity.PrerequisiteCode))
        {
            prerequisiteName = allColonyTechs
                .FirstOrDefault(t => t.Code == entity.PrerequisiteCode)?
                .Name ?? entity.PrerequisiteCode;
        }

        return new TechnologyDto
        {
            Id = entity.Id,
            ColonyId = entity.ColonyId,
            Code = entity.Code,
            Name = entity.Name,
            Description = entity.Description,
            Category = entity.Category,
            CategoryName = categoryName,
            MineralCost = entity.MineralCost,
            CreditCost = entity.CreditCost,
            DurationInSols = entity.DurationInSols,
            Progress = entity.Progress,
            Status = entity.Status,
            StatusName = statusName,
            PrerequisiteCode = entity.PrerequisiteCode,
            PrerequisiteName = prerequisiteName,
            BonusType = entity.BonusType,
            BonusTypeName = bonusTypeName,
            BonusValue = entity.BonusValue,
            BonusDescription = bonusDescription
        };
    }
}
