using Entities.Colonies;
using Entities.Colonists;
using Entities.Users;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Contexts;

public class SpaceColonyDbContext : DbContext
{
    public SpaceColonyDbContext(DbContextOptions<SpaceColonyDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; }

    public DbSet<Colony> Colonies { get; set; }

    public DbSet<Colonist> Colonists { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder
            .Entity<User>()
            .HasOne(u => u.Colony)
            .WithOne(c => c.User)
            .HasForeignKey<Colony>(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder
            .Entity<Colony>()
            .HasMany(c => c.Colonists)
            .WithOne(c => c.Colony)
            .HasForeignKey(c => c.ColonyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
