namespace Application.Tests.Mocks.FakeDatas;

using Core.Test.Application.FakeData;
using Domain.Entities;
using Domain.Enums;

public class BuildingFakeData : BaseFakeData<Building, int>
{
    public override List<Building> CreateFakeData()
    {
        return
        [
            new(
                id: 1,
                colonyId: 1,
                name: "Habitat Alpha",
                buildingType: BuildingType.Habitat,
                level: 1,
                health: 100,
                workers: 4,
                maxWorkers: 4,
                powerConsumption: 20,
                powerProduction: 0,
                isActive: true
            ),
            new(
                id: 2,
                colonyId: 1,
                name: "Güneş Paneli Tarlası",
                buildingType: BuildingType.SolarPanel,
                level: 5, // Maksimum seviyede bir bina (test için)
                health: 100,
                workers: 0,
                maxWorkers: 0,
                powerConsumption: 0,
                powerProduction: 200,
                isActive: true
            ),
            new(
                id: 3,
                colonyId: 1,
                name: "Hasarlı Sera Modülü",
                buildingType: BuildingType.Greenhouse,
                level: 2,
                health: 30,
                workers: 0,
                maxWorkers: 4,
                powerConsumption: 15,
                powerProduction: 0,
                isActive: false // Devre dışı / pasif bina (test için)
            ),
        ];
    }
}
