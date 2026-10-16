namespace Application.Tests.Features.Colonists.Commands.Create;

using Application.Features.Colonists.Commands.Create;
using Application.Tests.Mocks.FakeDatas;
using Application.Tests.Mocks.Repositories.Colonists;
using Core.CrossCuttingConcerns.Exception.Types;
using Domain.Enums;
using Xunit;

public class CreateColonistTests : ColonistMockRepository
{
    private readonly CreateColonistCommand _command;
    private readonly CreateColonistCommand.CreateColonistCommandHandler _handler;

    public CreateColonistTests(ColonistFakeData colonistFakeData, CreateColonistCommand command)
        : base(colonistFakeData)
    {
        _command = command;
        _handler = new(MockRepository.Object, Mapper, BusinessRules);
    }

    [Fact]
    public async Task Handle_WhenColonistNameIsUnique_ShouldReturnCreatedColonistResponse()
    {
        // Arrange
        _command.ColonyId = 1;
        _command.Name = "Jhon Snow";
        _command.Role = ColonistRole.Biologist;

        // Act
        CreatedColonistResponse result = await _handler.Handle(_command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Jhon Snow", result.Name);
        Assert.Equal(ColonistRole.Biologist, result.Role);
        Assert.Equal(100, result.Health);
    }

    [Fact]
    public async Task Handle_WhenColonistNameAlreadyExistsInSameColony_ShouldThrowBusinessException()
    {
        // Arrange (FakeData içinde "Neil Armstrong" zaten var)
        _command.ColonyId = 1;
        _command.Name = "Neil Armstrong";
        _command.Role = ColonistRole.Engineer;

        // Act
        async Task Act() => await _handler.Handle(_command, CancellationToken.None);

        // Assert
        await Assert.ThrowsAsync<BusinessException>(Act);
    }
}
