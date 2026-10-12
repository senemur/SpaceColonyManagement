using Microsoft.EntityFrameworkCore;

namespace Core.Persistence.DbMigrationApplier;

public class DbMigrationApplierManager<TDbContext>(TDbContext context)
    : IDbMigrationApplierService<TDbContext>
    where TDbContext : DbContext
{
    public void Initialize()
    {
        context.Database.EnsureDbApplied();
    }
}
