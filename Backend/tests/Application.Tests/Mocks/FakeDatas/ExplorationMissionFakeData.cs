namespace Application.Tests.Mocks.FakeDatas;

using Core.Test.Application.FakeData;
using Domain.Entities;
using Domain.Enums;

public class ExplorationMissionFakeData : BaseFakeData<ExplorationMission, int>
{
    public override List<ExplorationMission> CreateFakeData()
    {
        return
        [
            new(
                id: 1,
                colonyId: 1,
                name: "Görünmeyen Kanyon Buz Analizi",
                targetZone: "Güney Krateri",
                description: "Krater tabanı buz analizi.",
                riskLevel: MissionRiskLevel.Low,
                durationInSols: 1,
                energyCost: 25,
                waterCost: 5,
                creditsCost: 0,
                rewardMinerals: 50,
                rewardWater: 250,
                rewardCredits: 100,
                rewardDescription: "+250 Su, +50 Maden",
                status: MissionStatus.Available
            ),
            new(
                id: 2,
                colonyId: 1,
                name: "Olympus Mons Vadi Taraması",
                targetZone: "Kuzey Sektörü 4",
                description: "Cevherleşme taraması.",
                riskLevel: MissionRiskLevel.Medium,
                durationInSols: 2,
                energyCost: 50,
                waterCost: 15,
                creditsCost: 200,
                rewardMinerals: 400,
                rewardWater: 150,
                rewardCredits: 500,
                rewardDescription: "+400 Maden, +150 Su, +500 Kredi",
                status: MissionStatus.InProgress
            ),
            new(
                id: 3,
                colonyId: 1,
                name: "Eski Yeraltı Mağara Araştırması",
                targetZone: "Derin Mağara B-9",
                description: "Artefakt arayışı.",
                riskLevel: MissionRiskLevel.High,
                durationInSols: 3,
                energyCost: 90,
                waterCost: 25,
                creditsCost: 500,
                rewardMinerals: 650,
                rewardWater: 300,
                rewardCredits: 2000,
                rewardDescription: "+650 Maden, +300 Su, +2000 Kredi",
                status: MissionStatus.Completed
            )
        ];
    }
}
