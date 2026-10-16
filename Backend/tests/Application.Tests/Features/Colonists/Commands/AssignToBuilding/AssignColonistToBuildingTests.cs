namespace Application.Tests.Features.Colonists.Commands.AssignToBuilding;

using Application.Features.Colonists.Commands.AssignToBuilding;
using Application.Services.Repositories;
using Application.Tests.Mocks.FakeDatas;
using Application.Tests.Mocks.Repositories.Colonists;
using Core.CrossCuttingConcerns.Exception.Types;
using Core.Test.Application.Helpers;
using Domain.Entities;
using Moq;
using Xunit;

public class AssignColonistToBuildingTests : ColonistMockRepository
{
    private readonly AssignColonistToBuildingCommand _command;
    private readonly AssignColonistToBuildingCommand.AssignColonistToBuildingCommandHandler _handler;
    private readonly Mock<IBuildingRepository> _buildingMockRepository;

    public AssignColonistToBuildingTests(
        ColonistFakeData colonistFakeData,
        BuildingFakeData buildingFakeData,
        AssignColonistToBuildingCommand command
    )
        : base(colonistFakeData)
    {
        _command = command;
        _buildingMockRepository = MockRepositoryHelper.GetRepository<
            IBuildingRepository,
            Building,
            int
        >(buildingFakeData.Data);
        _handler = new(
            MockRepository.Object,
            _buildingMockRepository.Object,
            Mapper,
            BusinessRules
        );
    }

    [Fact]
    public async Task Handle_WhenColonistAndBuildingAreValid_ShouldAssignSuccessfully()
    {
        // Arrange (Colonist Id: 1 boşta, Building Id: 1 geçerli)
        _command.ColonistId = 1;
        _command.BuildingId = 1;

        // Act
        AssignedColonistToBuildingResponse result = await _handler.Handle(
            _command,
            CancellationToken.None
        );

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.BuildingId);
        Assert.True(result.IsAssigned);
    }

    [Fact]
    public async Task Handle_WhenColonistHealthIsTooLow_ShouldThrowBusinessException()
    {
        // Arrange (Colonist Id: 3 sağlık %15 - ağır hasta/yaralı)
        _command.ColonistId = 3;
        _command.BuildingId = 1;

        // Act
        async Task Act() => await _handler.Handle(_command, CancellationToken.None);

        // Assert
        await Assert.ThrowsAsync<BusinessException>(Act);
    }

    [Fact]
    public async Task Handle_WhenBuildingIsInactive_ShouldThrowBusinessException()
    {
        // Arrange (Building Id: 3 pasif/hasarlı bina)
        _command.ColonistId = 1;
        _command.BuildingId = 3;

        // Act
        async Task Act() => await _handler.Handle(_command, CancellationToken.None);

        // Assert
        await Assert.ThrowsAsync<BusinessException>(Act);
    }

    [Fact]
    public async Task Handle_WhenBuildingIdIsNull_ShouldUnassignColonist()
    {
        // Arrange (Colonist Id: 2 zaten binada çalışıyor, boşa çıkarıyoruz)
        _command.ColonistId = 2;
        _command.BuildingId = null;

        // Act
        AssignedColonistToBuildingResponse result = await _handler.Handle(
            _command,
            CancellationToken.None
        );

        // Assert
        Assert.NotNull(result);
        Assert.Null(result.BuildingId);
        Assert.False(result.IsAssigned);
    }

    [Fact]
    public async Task Handle_WhenBuildingCapacityIsFull_ShouldThrowBusinessException()
    {
        // Arrange (Building Id: 1'in kapasitesini geçici olarak dolduruyoruz)
        var building = _buildingMockRepository.Object.GetAsync(b => b.Id == 1).Result;
        building!.Workers = building.MaxWorkers; // 4/4 dolu yap

        _command.ColonistId = 1;
        _command.BuildingId = 1;

        // Act
        async Task Act() => await _handler.Handle(_command, CancellationToken.None);

        // Assert
        await Assert.ThrowsAsync<BusinessException>(Act);
    }
}
