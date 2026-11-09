namespace Application.Tests.Features.Colonies.Commands;

using Application.Features.Colonies.Commands.ProcessOfflineProgress;
using Application.Tests.Mocks.FakeDatas;
using Application.Tests.Mocks.Repositories.Buildings;
using Application.Tests.Mocks.Repositories.Colonies;
using Application.Tests.Mocks.Repositories.Colonists;
using Application.Tests.Mocks.Repositories.Events;
using Application.Tests.Mocks.Repositories.Research;
using Core.CrossCuttingConcerns.Exception.Types;
using Xunit;

public class ProcessOfflineProgressTests
{
    private readonly ColonyMockRepository _colonyMock;
    private readonly BuildingMockRepository _buildingMock;
    private readonly ColonistMockRepository _colonistMock;
    private readonly TechnologyMockRepository _technologyMock;
    private readonly ColonyEventMockRepository _eventMock;
    private readonly ProcessOfflineProgressCommand _command;
    private readonly ProcessOfflineProgressCommand.ProcessOfflineProgressCommandHandler _handler;

    public ProcessOfflineProgressTests(
        ColonyFakeData colonyFakeData,
        BuildingFakeData buildingFakeData,
        ColonistFakeData colonistFakeData,
        TechnologyFakeData technologyFakeData,
        ColonyEventFakeData eventFakeData,
        ProcessOfflineProgressCommand command
    )
    {
        _colonyMock = new ColonyMockRepository(colonyFakeData);
        _buildingMock = new BuildingMockRepository(buildingFakeData);
        _colonistMock = new ColonistMockRepository(colonistFakeData);
        _technologyMock = new TechnologyMockRepository(technologyFakeData);
        _eventMock = new ColonyEventMockRepository(eventFakeData);
        _command = command;

        _handler = new ProcessOfflineProgressCommand.ProcessOfflineProgressCommandHandler(
            _colonyMock.MockRepository.Object,
            _buildingMock.MockRepository.Object,
            _colonistMock.MockRepository.Object,
            _technologyMock.MockRepository.Object,
            _eventMock.MockRepository.Object,
            _colonyMock.BusinessRules
        );
    }

    [Fact]
    public async Task Handle_WhenColonyHasOfflineTime_ShouldProcessProgressionAndReturnReport()
    {
        // Arrange (Colony 1 has LastActiveDate = 30 minutes ago in FakeData)
        _command.ColonyId = 1;

        // Act
        OfflineProgressResponse response = await _handler.Handle(_command, CancellationToken.None);

        // Assert
        Assert.NotNull(response);
        Assert.True(response.HasProgress);
        Assert.True(response.ElapsedMinutes >= 25);
        Assert.True(response.SolsAdvanced >= 1);
        Assert.NotEmpty(response.SummaryMessage);
    }

    [Fact]
    public async Task Handle_WhenColonyDoesNotExist_ShouldThrowBusinessException()
    {
        // Arrange
        _command.ColonyId = 999;

        // Act & Assert
        await Assert.ThrowsAsync<BusinessException>(() =>
            _handler.Handle(_command, CancellationToken.None)
        );
    }
}
