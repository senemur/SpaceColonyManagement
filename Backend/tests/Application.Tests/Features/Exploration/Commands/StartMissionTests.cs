namespace Application.Tests.Features.Exploration.Commands;

using Application.Features.Exploration.Commands.StartMission;
using Application.Features.Exploration.Queries.GetMissionsByColonyId;
using Application.Tests.Mocks.FakeDatas;
using Application.Tests.Mocks.Repositories.Colonies;
using Application.Tests.Mocks.Repositories.Exploration;
using Core.CrossCuttingConcerns.Exception.Types;
using Domain.Enums;
using Xunit;

public class StartMissionTests
{
    private readonly ExplorationMissionMockRepository _explorationMock;
    private readonly ColonyMockRepository _colonyMock;
    private readonly StartMissionCommand _command;
    private readonly StartMissionCommand.StartMissionCommandHandler _handler;

    public StartMissionTests(
        ExplorationMissionFakeData explorationFakeData,
        ColonyFakeData colonyFakeData,
        StartMissionCommand command
    )
    {
        _explorationMock = new ExplorationMissionMockRepository(explorationFakeData);
        _colonyMock = new ColonyMockRepository(colonyFakeData);
        _command = command;

        _handler = new StartMissionCommand.StartMissionCommandHandler(
            _explorationMock.MockRepository.Object,
            _colonyMock.MockRepository.Object,
            _explorationMock.BusinessRules,
            _colonyMock.BusinessRules
        );
    }

    [Fact]
    public async Task Handle_WhenMissionIsAvailableAndResourcesSufficient_ShouldStartMission()
    {
        // Arrange (Mission 1 is Available with low cost)
        _command.ColonyId = 1;
        _command.MissionId = 1;

        // Act
        ExplorationMissionDto result = await _handler.Handle(_command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(MissionStatus.InProgress, result.Status);
        Assert.Equal("Devam Ediyor", result.StatusName);
    }

    [Fact]
    public async Task Handle_WhenMissionDoesNotExist_ShouldThrowBusinessException()
    {
        // Arrange
        _command.ColonyId = 1;
        _command.MissionId = 999;

        // Act & Assert
        await Assert.ThrowsAsync<BusinessException>(() =>
            _handler.Handle(_command, CancellationToken.None)
        );
    }

    [Fact]
    public async Task Handle_WhenMissionIsAlreadyInProgress_ShouldThrowBusinessException()
    {
        // Arrange (Mission 2 is InProgress in FakeData)
        _command.ColonyId = 1;
        _command.MissionId = 2;

        // Act & Assert
        await Assert.ThrowsAsync<BusinessException>(() =>
            _handler.Handle(_command, CancellationToken.None)
        );
    }
}
