namespace Application.Tests.Mocks.Repositories.Events;

using Application.Features.Events.Profiles;
using Application.Features.Events.Rules;
using Application.Services.Repositories;
using Application.Tests.Mocks.FakeDatas;
using Core.Test.Application.Repositories;
using Domain.Entities;

public class ColonyEventMockRepository(ColonyEventFakeData colonyEventFakeData)
    : BaseMockRepository<
        IColonyEventRepository,
        ColonyEvent,
        int,
        MappingProfiles,
        ColonyEventBusinessRules,
        ColonyEventFakeData
    >(colonyEventFakeData) { }
