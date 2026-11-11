namespace Application.Tests.Features.Colonies.Commands;

using Application.Features.Colonies.Commands.PerformAction;
using Application.Tests.Mocks.FakeDatas;
using Application.Tests.Mocks.Repositories.Buildings;
using Application.Tests.Mocks.Repositories.Colonies;
using Application.Tests.Mocks.Repositories.Events;
using Application.Tests.Mocks.Repositories.Research;
using Core.CrossCuttingConcerns.Exception.Types;
using Xunit;

public class PerformColonyActionTests
{
    private readonly ColonyMockRepository _colonyMock;
    private readonly BuildingMockRepository _buildingMock;
    private readonly TechnologyMockRepository _technologyMock;
    private readonly ColonyEventMockRepository _eventMock;
    private readonly PerformColonyActionCommand.PerformColonyActionCommandHandler _handler;

    public PerformColonyActionTests(
        ColonyFakeData colonyFakeData,
        BuildingFakeData buildingFakeData,
        TechnologyFakeData technologyFakeData,
        ColonyEventFakeData eventFakeData
    )
    {
        _colonyMock = new ColonyMockRepository(colonyFakeData);
        _buildingMock = new BuildingMockRepository(buildingFakeData);
        _technologyMock = new TechnologyMockRepository(technologyFakeData);
        _eventMock = new ColonyEventMockRepository(eventFakeData);

        _handler = new PerformColonyActionCommand.PerformColonyActionCommandHandler(
            _colonyMock.MockRepository.Object,
            _buildingMock.MockRepository.Object,
            _technologyMock.MockRepository.Object,
            _eventMock.MockRepository.Object,
            _colonyMock.BusinessRules
        );
    }

    [Fact]
    public async Task Handle_WhenHarvestFood_ShouldIncreaseFoodAndReturnResponse()
    {
        var command = new PerformColonyActionCommand
        {
            ColonyId = 1,
            ActionType = "HarvestFood",
            Amount = 45m
        };

        var response = await _handler.Handle(command, CancellationToken.None);

        Assert.NotNull(response);
        Assert.True(response.Success);
        Assert.Equal("Food", response.ResourceType);
        Assert.Equal(45m, response.ResourceGained);
        Assert.Contains("Sera hasadı", response.Message);
    }

    [Fact]
    public async Task Handle_WhenExtractWater_ShouldIncreaseWaterAndReturnResponse()
    {
        var command = new PerformColonyActionCommand
        {
            ColonyId = 1,
            ActionType = "ExtractWater",
            Amount = 50m
        };

        var response = await _handler.Handle(command, CancellationToken.None);

        Assert.NotNull(response);
        Assert.True(response.Success);
        Assert.Equal("Water", response.ResourceType);
        Assert.Equal(50m, response.ResourceGained);
        Assert.Contains("Su çıkarma", response.Message);
    }

    [Fact]
    public async Task Handle_WhenMineOre_ShouldIncreaseMineralsAndReturnResponse()
    {
        var command = new PerformColonyActionCommand
        {
            ColonyId = 1,
            ActionType = "MineOre",
            Amount = 60m
        };

        var response = await _handler.Handle(command, CancellationToken.None);

        Assert.NotNull(response);
        Assert.True(response.Success);
        Assert.Equal("Minerals", response.ResourceType);
        Assert.Equal(60m, response.ResourceGained);
        Assert.Contains("madenciliği", response.Message);
    }

    [Fact]
    public async Task Handle_WhenColonyDoesNotExist_ShouldThrowBusinessException()
    {
        var command = new PerformColonyActionCommand
        {
            ColonyId = 999,
            ActionType = "HarvestFood",
            Amount = 45m
        };

        await Assert.ThrowsAsync<BusinessException>(() =>
            _handler.Handle(command, CancellationToken.None)
        );
    }
}
