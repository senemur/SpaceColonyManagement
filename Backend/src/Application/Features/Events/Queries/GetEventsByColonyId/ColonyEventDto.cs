namespace Application.Features.Events.Queries.GetEventsByColonyId;

using Domain.Entities;
using Domain.Enums;

public class ColonyEventDto
{
    public int Id { get; set; }
    public int ColonyId { get; set; }
    public int Sol { get; set; }
    public string Time { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public EventType Type { get; set; }
    public string TypeName { get; set; } = string.Empty;
    public EventEffectType EffectType { get; set; }
    public string EffectTypeName { get; set; } = string.Empty;
    public decimal EffectValue { get; set; }
    public int DurationInSols { get; set; }
    public int RemainingSols { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }

    public static ColonyEventDto FromEntity(ColonyEvent entity)
    {
        string typeName = entity.Type switch
        {
            EventType.Success => "Success",
            EventType.Warning => "Warning",
            EventType.Critical => "Critical",
            _ => "Info"
        };

        string effectTypeName = entity.EffectType switch
        {
            EventEffectType.MineralGrant => "Maden Kazancı",
            EventEffectType.WaterGrant => "Su Rezervi Kazancı",
            EventEffectType.FoodGrant => "Besin Kazancı",
            EventEffectType.CreditGrant => "Kredi Desteği",
            EventEffectType.PowerProductionModifier => "Enerji Üretim Etkisi",
            EventEffectType.FoodProductionModifier => "Besin Üretim Etkisi",
            EventEffectType.WaterProductionModifier => "Su Üretim Etkisi",
            EventEffectType.ColonistHealthEffect => "Kolonist Sağlık Etkisi",
            _ => "Bilgilendirme"
        };

        return new ColonyEventDto
        {
            Id = entity.Id,
            ColonyId = entity.ColonyId,
            Sol = entity.Sol,
            Time = entity.CreatedDate.ToString("HH:mm"),
            Title = entity.Title,
            Message = entity.Message,
            Type = entity.Type,
            TypeName = typeName,
            EffectType = entity.EffectType,
            EffectTypeName = effectTypeName,
            EffectValue = entity.EffectValue,
            DurationInSols = entity.DurationInSols,
            RemainingSols = entity.RemainingSols,
            IsActive = entity.IsActive,
            CreatedDate = entity.CreatedDate
        };
    }
}
