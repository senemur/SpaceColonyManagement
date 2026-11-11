namespace Application.Tests.Features.Colonies.Queries;

using Application.Features.Colonies.Queries.GetAll;
using Application.Features.Colonies.Queries.GetOverview;
using Application.Services;
using Application.Tests.Mocks.FakeDatas;
using Application.Tests.Mocks.Repositories.Colonies;
using Xunit;

public class GetAllColoniesTests : ColonyMockRepository
{
    private readonly GetAllColoniesQuery.GetAllColoniesQueryHandler _handler;

    public GetAllColoniesTests(ColonyFakeData colonyFakeData)
        : base(colonyFakeData)
    {
        IColonyService colonyService = new ColonyManager(MockRepository.Object);
        _handler = new(colonyService, Mapper);
    }

    [Fact]
    public async Task Handle_ShouldReturnListOfColonies()
    {
        var query = new GetAllColoniesQuery();

        List<GetColonyOverviewResponse> result = await _handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.NotEmpty(result);
    }
}
