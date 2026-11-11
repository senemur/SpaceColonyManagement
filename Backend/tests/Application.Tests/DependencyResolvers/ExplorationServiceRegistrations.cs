namespace Application.Tests.DependencyResolvers;

using Application.Features.Exploration.Commands.StartMission;
using Application.Features.Exploration.Queries.GetMissionsByColonyId;
using Application.Tests.Mocks.FakeDatas;
using Microsoft.Extensions.DependencyInjection;

public static class ExplorationServiceRegistrations
{
    public static void AddExplorationServices(this IServiceCollection services)
    {
        services.AddTransient<ExplorationMissionFakeData>();
        services.AddTransient<StartMissionCommand>();
        services.AddTransient<GetMissionsByColonyIdQuery>();
    }
}
