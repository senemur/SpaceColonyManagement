namespace Application.Tests.Mocks.Repositories.Colonies;

using Application.Features.Colonies.Profiles;
using Application.Features.Colonies.Rules;
using Application.Services.Repositories;
using Application.Tests.Mocks.FakeDatas;
using Core.Test.Application.Repositories;
using Domain.Entities;

public class ColonyMockRepository(ColonyFakeData colonyFakeData)
    : BaseMockRepository<
        IColonyRepository,
        Colony,
        int,
        MappingProfiles,
        ColonyBusinessRules,
        ColonyFakeData
    >(colonyFakeData) { }
