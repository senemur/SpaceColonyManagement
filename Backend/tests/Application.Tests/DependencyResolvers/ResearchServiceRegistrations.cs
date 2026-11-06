namespace Application.Tests.DependencyResolvers;

using Application.Features.Research.Commands.StartResearch;
using Application.Features.Research.Queries.GetTechTree;
using Application.Tests.Mocks.FakeDatas;
using Microsoft.Extensions.DependencyInjection;

public static class ResearchServiceRegistrations
{
    public static void AddResearchServices(this IServiceCollection services)
    {
        services.AddTransient<TechnologyFakeData>();
        services.AddTransient<StartResearchCommand>();
        services.AddTransient<GetTechTreeQuery>();
    }
}
