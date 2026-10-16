namespace Application.Tests.DependencyResolvers;

using Application.Features.Colonists.Commands.AssignToBuilding;
using Application.Features.Colonists.Commands.Create;
using Application.Features.Colonists.Queries.GetListByColonyId;
using Application.Tests.Mocks.FakeDatas;
using Microsoft.Extensions.DependencyInjection;

public static class ColonistServiceRegistrations
{
    public static void AddColonistServices(this IServiceCollection services)
    {
        services.AddTransient<ColonistFakeData>();
        services.AddTransient<CreateColonistCommand>();
        services.AddTransient<AssignColonistToBuildingCommand>();
        services.AddTransient<GetListByColonyIdColonistQuery>();
    }
}
