namespace Application.Tests.Mocks.FakeDatas;

using Core.Test.Application.FakeData;
using Domain.Entities;
using Domain.ValueObjects;

public class ColonyFakeData : BaseFakeData<Colony, int>
{
    public override List<Colony> CreateFakeData()
    {
        return
        [
            new(
                id: 1,
                name: "Ares",
                description: "Mars merkez üssü",
                commander: "John Ares",
                location: "Valles Marineris",
                planet: "Mars",
                stats: new ColonyStats(sol: 10, population: 15)
            ),
            new(
                id: 2,
                name: "Olympus Base",
                description: "Olympus Mons üssü.",
                commander: "Jane Doe",
                location: "Olympus Mons",
                planet: "Mars",
                stats: new ColonyStats(sol: 25, population: 30)
            ),
        ];
    }
}
