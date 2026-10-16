namespace Application.Tests.Mocks.FakeDatas;

using Core.Test.Application.FakeData;
using Domain.Entities;
using Domain.Enums;

public class ColonistFakeData : BaseFakeData<Colonist, int>
{
    public override List<Colonist> CreateFakeData()
    {
        return
        [
            new(
                id: 1,
                colonyId: 1,
                name: "Neil Armstrong",
                role: ColonistRole.Engineer,
                health: 100,
                morale: 100,
                stamina: 100,
                buildingId: null // Boşta
            ),
            new(
                id: 2,
                colonyId: 1,
                name: "Buzz Aldrin",
                role: ColonistRole.Miner,
                health: 90,
                morale: 85,
                stamina: 85,
                buildingId: 1 // Habitat Alpha'da görevli
            ),
            new(
                id: 3,
                colonyId: 1,
                name: "Yaralı Kolonist",
                role: ColonistRole.Worker,
                health: 15, // Ağır yaralı (< %20) - Test için
                morale: 30,
                stamina: 20,
                buildingId: null
            ),
        ];
    }
}
