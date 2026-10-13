namespace Application.Tests.DependencyResolvers;

using Application.Features.Colonies.Commands.Create;
using Application.Features.Colonies.Queries.GetOverview;
using Application.Tests.Mocks.FakeDatas;
using Microsoft.Extensions.DependencyInjection;

public static class ColonyServiceRegistrations
{
    public static void AddColonyServices(this IServiceCollection services)
    {
        services.AddTransient<ColonyFakeData>();
        services.AddTransient<CreateColonyCommand>();
        services.AddTransient<GetColonyOverviewQuery>();
    }
}
