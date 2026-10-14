namespace Application.Tests.Mocks.Repositories.Buildings;

using Application.Features.Buildings.Profiles;
using Application.Features.Buildings.Rules;
using Application.Services.Repositories;
using Application.Tests.Mocks.FakeDatas;
using Core.Test.Application.Repositories;
using Domain.Entities;

public class BuildingMockRepository(BuildingFakeData buildingFakeData)
    : BaseMockRepository<
        IBuildingRepository,
        Building,
        int,
        MappingProfiles,
        BuildingBusinessRules,
        BuildingFakeData
    >(buildingFakeData) { }
