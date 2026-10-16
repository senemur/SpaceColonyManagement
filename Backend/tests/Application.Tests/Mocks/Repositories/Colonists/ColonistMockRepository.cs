namespace Application.Tests.Mocks.Repositories.Colonists;

using Application.Features.Colonists.Profiles;
using Application.Features.Colonists.Rules;
using Application.Services.Repositories;
using Application.Tests.Mocks.FakeDatas;
using Core.Test.Application.Repositories;
using Domain.Entities;

public class ColonistMockRepository(ColonistFakeData colonistFakeData)
    : BaseMockRepository<
        IColonistRepository,
        Colonist,
        int,
        MappingProfiles,
        ColonistBusinessRules,
        ColonistFakeData
    >(colonistFakeData) { }
