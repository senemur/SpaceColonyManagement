namespace Application.Tests.Features.Exploration.Queries;

using Application.Features.Exploration.Queries.GetMissionsByColonyId;
using Application.Tests.Mocks.FakeDatas;
using Application.Tests.Mocks.Repositories.Exploration;
using Xunit;

public class GetMissionsByColonyIdTests
{
    private readonly ExplorationMissionMockRepository _mockRepository;
    private readonly GetMissionsByColonyIdQuery.GetMissionsByColonyIdQueryHandler _handler;

    public GetMissionsByColonyIdTests(ExplorationMissionFakeData fakeData)
    {
        _mockRepository = new ExplorationMissionMockRepository(fakeData);
        _handler = new GetMissionsByColonyIdQuery.GetMissionsByColonyIdQueryHandler(
            _mockRepository.MockRepository.Object
        );
    }

    [Fact]
    public async Task Handle_WhenColonyHasMissions_ShouldReturnMissionsList()
    {
        // Arrange
        var query = new GetMissionsByColonyIdQuery { ColonyId = 1 };

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.NotEmpty(result);
        Assert.All(result, m => Assert.Equal(1, m.ColonyId));
    }
}
