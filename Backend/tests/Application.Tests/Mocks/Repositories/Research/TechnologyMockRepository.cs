namespace Application.Tests.Mocks.Repositories.Research;

using Application.Features.Research.Profiles;
using Application.Features.Research.Rules;
using Application.Services.Repositories;
using Application.Tests.Mocks.FakeDatas;
using Core.Test.Application.Repositories;
using Domain.Entities;

public class TechnologyMockRepository(TechnologyFakeData technologyFakeData)
    : BaseMockRepository<
        ITechnologyRepository,
        Technology,
        int,
        MappingProfiles,
        ResearchBusinessRules,
        TechnologyFakeData
    >(technologyFakeData) { }
