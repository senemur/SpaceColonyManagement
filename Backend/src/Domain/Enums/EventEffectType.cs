namespace Domain.Enums;

public enum EventEffectType
{
    None = 0,                    // Sadece bildirim, mekanik etki yok
    MineralGrant = 1,            // Anlık maden artışı
    WaterGrant = 2,              // Anlık su artışı
    FoodGrant = 3,               // Anlık besin artışı
    CreditGrant = 4,             // Anlık kredi artışı
    PowerProductionModifier = 5, // Süreli enerji üretim etkisi (% artış veya azalış)
    FoodProductionModifier = 6,  // Süreli besin üretim etkisi (% artış veya azalış)
    WaterProductionModifier = 7, // Süreli su üretim etkisi (% artış veya azalış)
    ColonistHealthEffect = 8     // Kolonist sağlığına/moraline etki
}
