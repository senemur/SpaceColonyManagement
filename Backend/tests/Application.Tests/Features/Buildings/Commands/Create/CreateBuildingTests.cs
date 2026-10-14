namespace Application.Tests.Features.Buildings.Commands.Create;

using Application.Features.Buildings.Commands.Create;
using Application.Tests.Mocks.FakeDatas;
using Application.Tests.Mocks.Repositories.Buildings;
using Core.CrossCuttingConcerns.Exception.Types;
using Domain.Enums;
using Xunit;

public class CreateBuildingTests : BuildingMockRepository
{
    private readonly CreateBuildingCommand _command;
    private readonly CreateBuildingCommand.CreateBuildingCommandHandler _handler;

    public CreateBuildingTests(BuildingFakeData buildingFakeData, CreateBuildingCommand command)
        : base(buildingFakeData)
    {
        _command = command;
        _handler = new(MockRepository.Object, Mapper, BusinessRules);
    }

    [Fact]
    public async Task Handle_WhenBuildingNAmeIsUniqueInColony_ShouldReturnCreatedBuildingResponse()
    {
        // Arrange
        _command.ColonyId = 1;
        _command.Name = "Maden Ocağı Beta";
        _command.BuildingType = BuildingType.Mine;
        _command.MaxWorkers = 6;
        _command.PowerConsumption = 50;

        // Act
        CreatedBuildingResponse result = await _handler.Handle(_command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(_command.Name, result.Name);
        Assert.Equal(1, result.Level);
        Assert.True(result.IsActive);
    }

    [Fact]
    public async Task Handle_WhenBuildingNameAlreadyExistsInSameColony_ShouldThrowBusinessException()
    {
        // Arrange (FakeData içinde Koloni 1'de "Habitat Alpha" zaten var)
        _command.ColonyId = 1;
        _command.Name = "Habitat Alpha";
        _command.BuildingType = BuildingType.Habitat;
        // Act
        async Task Act() => await _handler.Handle(_command, CancellationToken.None);
        // Assert
        await Assert.ThrowsAsync<BusinessException>(Act);
    }
}
