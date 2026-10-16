namespace Application.Tests;

using Application.Tests.DependencyResolvers;
using Microsoft.Extensions.DependencyInjection;

public sealed class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddColonyServices();
        services.AddBuildingServices();
        services.AddColonistServices();
    }
}
