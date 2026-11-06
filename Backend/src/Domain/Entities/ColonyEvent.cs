using Core.Persistence.Repositories;
using Domain.Enums;

namespace Domain.Entities;

public class ColonyEvent : Entity<int>
{
    public int ColonyId { get; set; }
    public int Sol { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public EventType Type { get; set; }
    public EventEffectType EffectType { get; set; }
    public decimal EffectValue { get; set; }
    public int DurationInSols { get; set; } // 0 ise anlık olay, >0 ise süreli
    public int RemainingSols { get; set; }
    public bool IsActive { get; set; }

    // Navigation Property
    public virtual Colony? Colony { get; set; }

    public ColonyEvent()
    {
        Type = EventType.Info;
        EffectType = EventEffectType.None;
        IsActive = false;
    }

    public ColonyEvent(
        int colonyId,
        int sol,
        string title,
        string message,
        EventType type,
        EventEffectType effectType = EventEffectType.None,
        decimal effectValue = 0,
        int durationInSols = 0,
        int remainingSols = 0,
        bool isActive = false
    )
    {
        ColonyId = colonyId;
        Sol = sol;
        Title = title;
        Message = message;
        Type = type;
        EffectType = effectType;
        EffectValue = effectValue;
        DurationInSols = durationInSols;
        RemainingSols = remainingSols;
        IsActive = isActive;
    }

    public ColonyEvent(
        int id,
        int colonyId,
        int sol,
        string title,
        string message,
        EventType type,
        EventEffectType effectType = EventEffectType.None,
        decimal effectValue = 0,
        int durationInSols = 0,
        int remainingSols = 0,
        bool isActive = false
    ) : base(id)
    {
        ColonyId = colonyId;
        Sol = sol;
        Title = title;
        Message = message;
        Type = type;
        EffectType = effectType;
        EffectValue = effectValue;
        DurationInSols = durationInSols;
        RemainingSols = remainingSols;
        IsActive = isActive;
    }
}
