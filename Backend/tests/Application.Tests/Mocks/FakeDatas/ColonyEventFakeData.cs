namespace Application.Tests.Mocks.FakeDatas;

using Core.Test.Application.FakeData;
using Domain.Entities;
using Domain.Enums;

public class ColonyEventFakeData : BaseFakeData<ColonyEvent, int>
{
    public override List<ColonyEvent> CreateFakeData()
    {
        return
        [
            new(
                id: 1,
                colonyId: 1,
                sol: 1,
                title: "Üs Kurulumu Tamamlandı",
                message: "İlk habitat ve paneller hazır.",
                type: EventType.Success,
                effectType: EventEffectType.None,
                effectValue: 0,
                durationInSols: 0,
                remainingSols: 0,
                isActive: false
            ),
            new(
                id: 2,
                colonyId: 1,
                sol: 2,
                title: "Toz Fırtınası",
                message: "Güneş enerjisi düştü.",
                type: EventType.Warning,
                effectType: EventEffectType.PowerProductionModifier,
                effectValue: -30,
                durationInSols: 2,
                remainingSols: 2,
                isActive: true
            ),
            new(
                id: 3,
                colonyId: 2,
                sol: 1,
                title: "Diğer Koloni Olayı",
                message: "Koloni 2 ilk olay.",
                type: EventType.Info,
                effectType: EventEffectType.None,
                effectValue: 0,
                durationInSols: 0,
                remainingSols: 0,
                isActive: false
            ),
        ];
    }
}
