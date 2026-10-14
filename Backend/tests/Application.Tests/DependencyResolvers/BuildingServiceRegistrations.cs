namespace Application.Tests.DependencyResolvers;

using Application.Features.Buildings.Commands.Create;
using Application.Features.Buildings.Commands.Upgrade;
using Application.Features.Buildings.Queries.GetListByColonyId;
using Application.Tests.Mocks.FakeDatas;
using Microsoft.Extensions.DependencyInjection;

public static class BuildingServiceRegistrations
{
    public static void AddBuildingServices(this IServiceCollection services)
    {
        services.AddTransient<BuildingFakeData>();
        services.AddTransient<CreateBuildingCommand>();
        services.AddTransient<UpgradeBuildingCommand>();
        services.AddTransient<GetListByColonyIdBuildingQuery>();
    }
}
