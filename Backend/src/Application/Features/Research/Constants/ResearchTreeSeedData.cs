namespace Application.Features.Research.Constants;

using Domain.Entities;
using Domain.Enums;

public static class ResearchTreeSeedData
{
    public static List<Technology> GetInitialTechnologiesForColony(int colonyId)
    {
        return new List<Technology>
        {
            new(
                colonyId: colonyId,
                code: "TECH_AGRI_1",
                name: "Gelişmiş Hidroponik Kültür",
                description: "Mars regolitinde bitki büyümesini hızlandıran optimize edilmiş organik besin solüsyonu.",
                category: ResearchCategory.Agriculture,
                mineralCost: 80,
                creditCost: 400,
                durationInSols: 2,
                progress: 0,
                status: ResearchStatus.Available,
                prerequisiteCode: null,
                bonusType: ResearchBonusType.FoodProduction,
                bonusValue: 25
            ),
            new(
                colonyId: colonyId,
                code: "TECH_AGRI_2",
                name: "Mars Toprağı Islahı & Gübreleme",
                description: "Topraktaki toksik perkloratları temizleyerek seralarda hasat verimini artıran biyo-gübreleme.",
                category: ResearchCategory.Agriculture,
                mineralCost: 200,
                creditCost: 1000,
                durationInSols: 3,
                progress: 0,
                status: ResearchStatus.Locked,
                prerequisiteCode: "TECH_AGRI_1",
                bonusType: ResearchBonusType.FoodProduction,
                bonusValue: 35
            ),
            new(
                colonyId: colonyId,
                code: "TECH_LIFE_1",
                name: "Derin Buz Sondajı",
                description: "Yeraltı buzul tabakalarını eritip hızla yüzeye aktaran termal sondaj başlığı.",
                category: ResearchCategory.LifeSupport,
                mineralCost: 100,
                creditCost: 500,
                durationInSols: 2,
                progress: 0,
                status: ResearchStatus.Available,
                prerequisiteCode: null,
                bonusType: ResearchBonusType.WaterProduction,
                bonusValue: 25
            ),
            new(
                colonyId: colonyId,
                code: "TECH_LIFE_2",
                name: "Kapalı Döngü Atmosfer Geri Dönüşümü",
                description: "Habitat havasını moleküler seviyede ayrıştırarak oksijen verimini artıran nano-filtrasyon ağı.",
                category: ResearchCategory.LifeSupport,
                mineralCost: 220,
                creditCost: 1100,
                durationInSols: 3,
                progress: 0,
                status: ResearchStatus.Locked,
                prerequisiteCode: "TECH_LIFE_1",
                bonusType: ResearchBonusType.OxygenProduction,
                bonusValue: 30
            ),
            new(
                colonyId: colonyId,
                code: "TECH_ENG_1",
                name: "Anti-Toz Güneş Paneli Kaplaması",
                description: "Mars tozunu yüzeyden uzak tutan elektrostatik nano kaplama teknolojisi.",
                category: ResearchCategory.Energy,
                mineralCost: 120,
                creditCost: 600,
                durationInSols: 2,
                progress: 0,
                status: ResearchStatus.Available,
                prerequisiteCode: null,
                bonusType: ResearchBonusType.PowerProduction,
                bonusValue: 25
            ),
            new(
                colonyId: colonyId,
                code: "TECH_ENG_2",
                name: "Füzyon Reaktörü Prototipi",
                description: "Fırtınalarda dahi koloniye devasa miktarda kesintisiz güç sağlayan manyetik füzyon çekirdeği.",
                category: ResearchCategory.Energy,
                mineralCost: 350,
                creditCost: 2000,
                durationInSols: 4,
                progress: 0,
                status: ResearchStatus.Locked,
                prerequisiteCode: "TECH_ENG_1",
                bonusType: ResearchBonusType.PowerProduction,
                bonusValue: 50
            ),
            new(
                colonyId: colonyId,
                code: "TECH_MINE_1",
                name: "Otomatik Maden Roverları",
                description: "Kanyonlardan demir ve mineral cevheri toplayan otonom yapay zeka üniteleri.",
                category: ResearchCategory.Mining,
                mineralCost: 150,
                creditCost: 750,
                durationInSols: 2,
                progress: 0,
                status: ResearchStatus.Available,
                prerequisiteCode: null,
                bonusType: ResearchBonusType.MineralProduction,
                bonusValue: 30
            ),
            new(
                colonyId: colonyId,
                code: "TECH_MINE_2",
                name: "Hafif Karbon Kompozitler",
                description: "Bina yapımında ve yükseltmelerinde gereken malzeme maliyetini %20 düşüren süper alaşımlar.",
                category: ResearchCategory.Mining,
                mineralCost: 250,
                creditCost: 1500,
                durationInSols: 3,
                progress: 0,
                status: ResearchStatus.Locked,
                prerequisiteCode: "TECH_MINE_1",
                bonusType: ResearchBonusType.ConstructionDiscount,
                bonusValue: 20
            ),
        };
    }
}
