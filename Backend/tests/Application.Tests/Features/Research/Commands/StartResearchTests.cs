namespace Application.Tests.Features.Research.Commands;

using Application.Features.Research.Commands.StartResearch;
using Application.Services.Repositories;
using Application.Tests.Mocks.FakeDatas;
using Application.Tests.Mocks.Repositories.Research;
using Core.CrossCuttingConcerns.Exception.Types;
using Core.Test.Application.Helpers;
using Domain.Entities;
using Domain.Enums;
using Moq;
using Xunit;

public class StartResearchTests : TechnologyMockRepository
{
    private readonly StartResearchCommand _command;
    private readonly StartResearchCommand.StartResearchCommandHandler _handler;
    private readonly Mock<IColonyRepository> _colonyMockRepository;

    public StartResearchTests(
        TechnologyFakeData technologyFakeData,
        ColonyFakeData colonyFakeData,
        StartResearchCommand command
    ) : base(technologyFakeData)
    {
        _command = command;
        _colonyMockRepository = MockRepositoryHelper.GetRepository<
            IColonyRepository,
            Colony,
            int
        >(colonyFakeData.Data);

        _handler = new(
            MockRepository.Object,
            _colonyMockRepository.Object,
            BusinessRules
        );
    }

    [Fact]
    public async Task Handle_WhenValid_ShouldSetStatusInProgressAndDeductResources()
    {
        // Arrange
        _command.ColonyId = 1;
        _command.TechnologyId = 1; // TECH_AGRI_1 (Available, 80 minerals, 400 credits)

        // Act
        StartResearchResponse result = await _handler.Handle(_command, TestContext.Current.CancellationToken);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(ResearchStatus.InProgress, result.Status);
        Assert.Equal(1, result.TechnologyId);
        Assert.Contains("araştırması başlatıldı", result.Message);
    }

    [Fact]
    public async Task Handle_WhenPrerequisiteNotCompleted_ShouldThrowBusinessException()
    {
        // Arrange (TECH_AGRI_2 requires TECH_AGRI_1 which is not completed yet)
        _command.ColonyId = 1;
        _command.TechnologyId = 2;

        // Act & Assert
        await Assert.ThrowsAsync<BusinessException>(
            async () => await _handler.Handle(_command, TestContext.Current.CancellationToken)
        );
    }

    [Fact]
    public async Task Handle_WhenAlreadyCompleted_ShouldThrowBusinessException()
    {
        // Arrange (TECH_COMPLETED id: 3 is already completed)
        _command.ColonyId = 1;
        _command.TechnologyId = 3;

        // Act & Assert
        await Assert.ThrowsAsync<BusinessException>(
            async () => await _handler.Handle(_command, TestContext.Current.CancellationToken)
        );
    }

    [Fact]
    public async Task Handle_WhenAnotherResearchAlreadyInProgress_ShouldThrowBusinessException()
    {
        // Arrange (In colony 2, TECH_IN_PROGRESS id: 4 is already in progress)
        var tech = new Technology(
            id: 10,
            colonyId: 2,
            code: "TECH_ANOTHER",
            name: "Başka Teknoloji",
            description: "Açıklama",
            category: ResearchCategory.Energy,
            mineralCost: 10,
            creditCost: 10,
            durationInSols: 1,
            progress: 0,
            status: ResearchStatus.Available,
            prerequisiteCode: null,
            bonusType: ResearchBonusType.PowerProduction,
            bonusValue: 5
        );
        await MockRepository.Object.AddAsync(tech, TestContext.Current.CancellationToken);

        _command.ColonyId = 2;
        _command.TechnologyId = 10;

        // Act & Assert
        await Assert.ThrowsAsync<BusinessException>(
            async () => await _handler.Handle(_command, TestContext.Current.CancellationToken)
        );
    }
}
