using Core.CrossCuttingConcerns.Logging.Abstraction;
using Microsoft.Extensions.DependencyInjection;

namespace Core.CrossCuttingConcerns.Logging.DependencyInjection;

public static class ServiceCollectionLoggingExtensions
{
    public static IServiceCollection AddLogging(this IServiceCollection services, ILogger logger)
    {
        services.AddSingleton(logger);

        return services;
    }
}
