namespace Persistence;

using Application.Services.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
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
        string? connectionString = configuration.GetConnectionString(connectionStringName);

        // EF Core Migration / Design-Time durumunda her zaman Npgsql kullan
        if (EF.IsDesignTime)
        {
            services.AddDbContext<BaseDbContext>(options => options.UseNpgsql(connectionString));
            RegisterRepositories(services);
            return services;
        }

        bool useInMemory = configuration.GetValue<bool>("UseInMemoryDatabase");

        if (!useInMemory && !string.IsNullOrWhiteSpace(connectionString) && !connectionString.Contains("your_host"))
        {
            try
            {
                var testBuilder = new NpgsqlConnectionStringBuilder(connectionString)
                {
                    Timeout = 3,
                    CommandTimeout = 3
                };
                using var testConn = new NpgsqlConnection(testBuilder.ConnectionString);
                testConn.Open();
                Console.WriteLine("✅ Supabase PostgreSQL veritabanına başarıyla bağlanıldı.");
                services.AddDbContext<BaseDbContext>(options => options.UseNpgsql(connectionString));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Supabase PostgreSQL bağlantısı sağlanamadı ({ex.Message}). Kesintisiz geliştirme için In-Memory veritabanına geçiliyor...");
                useInMemory = true;
            }
        }

        if (useInMemory || string.IsNullOrWhiteSpace(connectionString) || connectionString.Contains("your_host"))
        {
            services.AddDbContext<BaseDbContext>(options => options.UseInMemoryDatabase("SpaceColonyInMemoryDb"));
        }

        RegisterRepositories(services);

        return services;
    }

    private static void RegisterRepositories(IServiceCollection services)
    {
        services.AddScoped<IColonyRepository, ColonyRepository>();
        services.AddScoped<IBuildingRepository, BuildingRepository>();
        services.AddScoped<IColonistRepository, ColonistRepository>();
        services.AddScoped<ITechnologyRepository, TechnologyRepository>();
        services.AddScoped<IColonyEventRepository, ColonyEventRepository>();
    }
}
