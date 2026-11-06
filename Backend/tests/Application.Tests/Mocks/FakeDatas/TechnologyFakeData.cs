namespace Application.Tests.Mocks.FakeDatas;

using Core.Test.Application.FakeData;
using Domain.Entities;
using Domain.Enums;

public class TechnologyFakeData : BaseFakeData<Technology, int>
{
    public override List<Technology> CreateFakeData()
    {
        return
        [
            new(
                id: 1,
                colonyId: 1,
                code: "TECH_AGRI_1",
                name: "Gelişmiş Hidroponik Kültür",
                description: "Organik besin solüsyonu.",
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
                id: 2,
                colonyId: 1,
                code: "TECH_AGRI_2",
                name: "Mars Toprağı Islahı",
                description: "Toprak ıslahı.",
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
                id: 3,
                colonyId: 1,
                code: "TECH_COMPLETED",
                name: "Temel Fizik",
                description: "Tamamlanan araştırma.",
                category: ResearchCategory.Energy,
                mineralCost: 50,
                creditCost: 200,
                durationInSols: 1,
                progress: 100,
                status: ResearchStatus.Completed,
                prerequisiteCode: null,
                bonusType: ResearchBonusType.PowerProduction,
                bonusValue: 10
            ),
            new(
                id: 4,
                colonyId: 2,
                code: "TECH_IN_PROGRESS",
                name: "Devam Eden Araştırma",
                description: "Süren araştırma.",
                category: ResearchCategory.Mining,
                mineralCost: 100,
                creditCost: 500,
                durationInSols: 2,
                progress: 50,
                status: ResearchStatus.InProgress,
                prerequisiteCode: null,
                bonusType: ResearchBonusType.MineralProduction,
                bonusValue: 20
            ),
        ];
    }
}
