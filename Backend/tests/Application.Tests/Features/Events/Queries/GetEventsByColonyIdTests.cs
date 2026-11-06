namespace Application.Tests.Features.Events.Queries;

using Application.Features.Events.Queries.GetEventsByColonyId;
using Application.Tests.Mocks.FakeDatas;
using Application.Tests.Mocks.Repositories.Events;
using Xunit;

public class GetEventsByColonyIdTests : ColonyEventMockRepository
{
    private readonly GetEventsByColonyIdQuery _query;
    private readonly GetEventsByColonyIdQuery.GetEventsByColonyIdQueryHandler _handler;

    public GetEventsByColonyIdTests(
        ColonyEventFakeData colonyEventFakeData,
        GetEventsByColonyIdQuery query
    ) : base(colonyEventFakeData)
    {
        _query = query;
        _handler = new(MockRepository.Object);
    }

    [Fact]
    public async Task Handle_WhenColonyHasEvents_ShouldReturnEventsOrderedBySolDescending()
    {
        // Arrange
        _query.ColonyId = 1;
        _query.Size = 10;

        // Act
        var result = await _handler.Handle(_query, TestContext.Current.CancellationToken);

        // Assert
        Assert.NotNull(result);
        Assert.NotEmpty(result);
        Assert.All(result, item => Assert.Equal(1, item.ColonyId));
        Assert.True(result[0].Sol >= result[^1].Sol);
    }

    [Fact]
    public async Task Handle_WhenActiveEventExists_ShouldReturnActiveStatusAndDuration()
    {
        // Arrange (FakeData ID: 2 is active with 2 sols duration)
        _query.ColonyId = 1;

        // Act
        var result = await _handler.Handle(_query, TestContext.Current.CancellationToken);

        // Assert
        var activeEvent = result.FirstOrDefault(e => e.Id == 2);
        Assert.NotNull(activeEvent);
        Assert.True(activeEvent.IsActive);
        Assert.Equal(2, activeEvent.RemainingSols);
        Assert.Equal("Warning", activeEvent.TypeName);
    }

    [Fact]
    public async Task Handle_WhenColonyHasNoEvents_ShouldReturnEmptyList()
    {
        // Arrange
        _query.ColonyId = 999;

        // Act
        var result = await _handler.Handle(_query, TestContext.Current.CancellationToken);

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
    }
}
