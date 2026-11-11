namespace Application.Tests.Mocks.Repositories.Exploration;

using Application.Features.Exploration.Profiles;
using Application.Features.Exploration.Rules;
using Application.Services.Repositories;
using Application.Tests.Mocks.FakeDatas;
using Core.Test.Application.Repositories;
using Domain.Entities;

public class ExplorationMissionMockRepository(ExplorationMissionFakeData fakeData)
    : BaseMockRepository<
        IExplorationMissionRepository,
        ExplorationMission,
        int,
        MappingProfiles,
        ExplorationMissionBusinessRules,
        ExplorationMissionFakeData
    >(fakeData) { }
