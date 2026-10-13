namespace Persistence;

using Application.Services.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence.Contexts;
using Persistence.Repositories;

public static class PersistenceServiceRegistration
{
    public static IServiceCollection AddPersistenceServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        string connectionStringName = "BaseDb";
        string connectionString =
            configuration.GetConnectionString(connectionStringName)
            ?? throw new InvalidOperationException(
                $"\"{connectionStringName}\" connection string not found in configuration."
            );

        // Supabase (PostgreSQL) bağlantısı
        services.AddDbContext<BaseDbContext>(options => options.UseNpgsql(connectionString));

        // Repository Kaydı
        services.AddScoped<IColonyRepository, ColonyRepository>();

        return services;
    }
}
