namespace Application.Tests.Features.Colonies.Commands.Create;

using Application.Features.Colonies.Commands.Create;
using Application.Tests.Mocks.FakeDatas;
using Application.Tests.Mocks.Repositories.Colonies;
using Core.CrossCuttingConcerns.Exception.Types;
using Xunit;

public class CreateColonyTests : ColonyMockRepository
{
    private readonly CreateColonyCommand _command;
    private readonly CreateColonyCommand.CreateColonyCommandHandler _handler;

    public CreateColonyTests(ColonyFakeData colonyFakeData, CreateColonyCommand command)
        : base(colonyFakeData)
    {
        _command = command;
        _handler = new(MockRepository.Object, Mapper, BusinessRules);
    }

    [Fact]
    public async Task Handle_WhenColonyNameIsUnique_ShouldReturnCreatedColonyResponse()
    {
        // Arrange
        _command.Name = "New Horizon";
        _command.Description = "Yeni keşif kolonisi";
        _command.Commander = "Captain Neil";
        _command.Planet = "Mars";
        _command.Location = "Elysium Planitia";

        // Act
        CreatedColonyResponse result = await _handler.Handle(_command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("New Horizon", result.Name);
    }

    [Fact]
    public async Task Handle_WhenColonyNameAlreadyExists_ShouldThrowBusinessException()
    {
        // Arrange (FakeData içerisinde zaten "Ares Prime" isimli bir koloni mevcut)
        _command.Name = "Ares";
        _command.Description = "Aynı isimli kopya koloni";
        _command.Commander = "John Ares";
        _command.Planet = "Mars";
        _command.Location = "Valles Marineris";

        // Act
        async Task Act() => await _handler.Handle(_command, CancellationToken.None);

        // Assert (İş kuralı çalışmalı ve BusinessException fırlatmalı)
        await Assert.ThrowsAsync<BusinessException>(Act);
    }
}
