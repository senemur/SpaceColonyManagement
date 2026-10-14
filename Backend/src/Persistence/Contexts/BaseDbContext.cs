namespace Persistence.Contexts;

using System.Reflection;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class BaseDbContext(DbContextOptions dbContextOptions, IConfiguration configuration)
    : DbContext(dbContextOptions)
{
    protected IConfiguration Configuration { get; set; } = configuration;

    public DbSet<Colony> Colonies { get; set; }
    public DbSet<Building> Buildings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
    }
}
