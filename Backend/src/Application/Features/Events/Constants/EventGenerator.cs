namespace Application.Features.Events.Constants;

using Domain.Entities;
using Domain.Enums;

public static class EventGenerator
{
    public static ColonyEvent? TryGenerateRandomEvent(
        int colonyId,
        int currentSol,
        List<ColonyEvent> existingActiveEvents,
        Colony colony
    )
    {
        // %50 ihtimalle rastgele olay meydana gelir
        if (Random.Shared.Next(100) < 50)
            return null;

        var activeTitles = existingActiveEvents
            .Where(e => e.IsActive)
            .Select(e => e.Title)
            .ToHashSet();

        var templates = new List<Func<ColonyEvent>>
        {
            // 1. Toz Fırtınası (Süreli Negatif / Warning)
            () => new ColonyEvent(
                colonyId: colonyId,
                sol: currentSol,
                title: "Mars Toz Fırtınası Yaklaşıyor",
                message: "Kuzey kraterlerinden esen yoğun toz fırtınası üssü etkisi altına aldı. Güneş paneli verimi %30 düştü (Süre: 2 Sol).",
                type: EventType.Warning,
                effectType: EventEffectType.PowerProductionModifier,
                effectValue: -30,
                durationInSols: 2,
                remainingSols: 2,
                isActive: true
            ),

            // 2. Zengin Mineral Damarı (Anlık Pozitif / Success)
            () => {
                decimal grant = 200;
                colony.Stats.Minerals += grant;
                return new ColonyEvent(
                    colonyId: colonyId,
                    sol: currentSol,
                    title: "Zengin Mineral Damarı Bulundu",
                    message: $"Jeolojik taramalarda yüzeye yakın zengin bir demir-titanyum damarı tespit edildi (+{grant:0} t Maden kazanıldı).",
                    type: EventType.Success,
                    effectType: EventEffectType.MineralGrant,
                    effectValue: grant,
                    durationInSols: 0,
                    remainingSols: 0,
                    isActive: false
                );
            },

            // 3. Yeraltı Buz Rezervi (Anlık Pozitif / Success)
            () => {
                decimal grant = 150;
                colony.Stats.Water = Math.Min(colony.Stats.MaxWater, colony.Stats.Water + grant);
                return new ColonyEvent(
                    colonyId: colonyId,
                    sol: currentSol,
                    title: "Yeraltı Buz Rezervi Bulundu",
                    message: $"Sondaj robotları yüksek saflıkta donmuş su katmanına ulaştı (+{grant:0} L Su üsse aktarıldı).",
                    type: EventType.Success,
                    effectType: EventEffectType.WaterGrant,
                    effectValue: grant,
                    durationInSols: 0,
                    remainingSols: 0,
                    isActive: false
                );
            },

            // 4. Mükemmel Hasat Sezonu (Süreli Pozitif / Success)
            () => new ColonyEvent(
                colonyId: colonyId,
                sol: currentSol,
                title: "Mükemmel Hasat Sezonu",
                message: "Hidroponik seralardaki nem ve ışık optimizasyonu üst seviyeye ulaştı. Besin üretimi %30 arttı (Süre: 2 Sol).",
                type: EventType.Success,
                effectType: EventEffectType.FoodProductionModifier,
                effectValue: 30,
                durationInSols: 2,
                remainingSols: 2,
                isActive: true
            ),

            // 5. Dünya'dan Tedarik Mekiği (Anlık Pozitif / Success)
            () => {
                decimal credits = 1000;
                decimal minerals = 100;
                colony.Stats.Credits += credits;
                colony.Stats.Minerals += minerals;
                return new ColonyEvent(
                    colonyId: colonyId,
                    sol: currentSol,
                    title: "Dünya'dan Tedarik Mekiği İndi",
                    message: $"Ares üssüne Dünya konsorsiyumundan ikmal podu ulaştı (+{credits:0} ₺ Kredi ve +{minerals:0} t Maden desteği).",
                    type: EventType.Success,
                    effectType: EventEffectType.CreditGrant,
                    effectValue: credits,
                    durationInSols: 0,
                    remainingSols: 0,
                    isActive: false
                );
            },

            // 6. Toz Alerjisi & Yorgunluk (Anlık Negatif / Warning)
            () => new ColonyEvent(
                colonyId: colonyId,
                sol: currentSol,
                title: "Mürettebatta Toz Alerjisi & Yorgunluk",
                message: "Hava filtreleme ünitesindeki gecikme kolonistlerde hafif solunum yorgunluğuna yol açtı (Sağlık ve Moral -10).",
                type: EventType.Warning,
                effectType: EventEffectType.ColonistHealthEffect,
                effectValue: -10,
                durationInSols: 0,
                remainingSols: 0,
                isActive: false
            ),

            // 7. Şebeke Dalgalanması (Süreli Negatif / Critical)
            () => new ColonyEvent(
                colonyId: colonyId,
                sol: currentSol,
                title: "Güç Dağıtım Şebekesi Dalgalanması",
                message: "Ana güç hattında aşırı yüklenme oldu. Sistem koruma moduna geçti, enerji üretimi %20 azaldı (Süre: 1 Sol).",
                type: EventType.Critical,
                effectType: EventEffectType.PowerProductionModifier,
                effectValue: -20,
                durationInSols: 1,
                remainingSols: 1,
                isActive: true
            ),
        };

        // Zaten aktif olan olayları tekrar seçme
        var availableTemplates = templates
            .Where(t => {
                var sample = t();
                return !activeTitles.Contains(sample.Title);
            })
            .ToList();

        if (!availableTemplates.Any())
            return null;

        int selectedIndex = Random.Shared.Next(availableTemplates.Count);
        return availableTemplates[selectedIndex]();
    }
}
