namespace Application.Tests.Features.Buildings.Commands.Upgrade;

using Application.Features.Buildings.Commands.Upgrade;
using Application.Tests.Mocks.FakeDatas;
using Application.Tests.Mocks.Repositories.Buildings;
using Core.CrossCuttingConcerns.Exception.Types;
using Xunit;

public class UpgradeBuildingTests : BuildingMockRepository
{
    private readonly UpgradeBuildingCommand _command;
    private readonly UpgradeBuildingCommand.UpgradeBuildingCommandHandler _handler;

    public UpgradeBuildingTests(BuildingFakeData buildingFakeData, UpgradeBuildingCommand command)
        : base(buildingFakeData)
    {
        _command = command;
        _handler = new(MockRepository.Object, Mapper, BusinessRules);
    }

    [Fact]
    public async Task Handle_WhenBuildingIsValid_ShouldIncreaseLevelAndStats()
    {
        // Arrange (Id 1: Seviye 1, aktif)
        _command.Id = 1;

        // Act
        UpgradedBuildingResponse result = await _handler.Handle(_command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Level);
        Assert.True(result.MaxWorkers >= 4);
    }

    [Fact]
    public async Task Handle_WhenBuildingReachedMaxLevel_ShouldThrowBusinessException()
    {
        // Arrange (Id 2: Seviye 5 - Maksimum sınır)
        _command.Id = 2;

        // Act
        async Task Act() => await _handler.Handle(_command, CancellationToken.None);

        // Assert
        await Assert.ThrowsAsync<BusinessException>(Act);
    }

    [Fact]
    public async Task Handle_WhenBuildingIsNotActive_ShouldThrowBusinessException()
    {
        // Arrange (Id 3: IsActive = false)
        _command.Id = 3;

        // Act
        async Task Act() => await _handler.Handle(_command, CancellationToken.None);

        // Assert
        await Assert.ThrowsAsync<BusinessException>(Act);
    }
}
