namespace Application.Tests.DependencyResolvers;

using Application.Features.Events.Queries.GetEventsByColonyId;
using Application.Tests.Mocks.FakeDatas;
using Microsoft.Extensions.DependencyInjection;

public static class EventServiceRegistrations
{
    public static void AddEventServices(this IServiceCollection services)
    {
        services.AddTransient<ColonyEventFakeData>();
        services.AddTransient<GetEventsByColonyIdQuery>();
    }
}
