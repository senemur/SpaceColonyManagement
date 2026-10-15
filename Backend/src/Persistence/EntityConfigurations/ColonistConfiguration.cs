namespace Persistence.EntityConfigurations;

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ColonistConfiguration : IEntityTypeConfiguration<Colonist>
{
    public void Configure(EntityTypeBuilder<Colonist> builder)
    {
        builder.ToTable("Colonists");
        builder.HasKey(c => c.Id);
        builder.HasKey(b => b.Id);
        builder.Property(oc => oc.CreatedDate).HasColumnName("CreatedDate").IsRequired();
        builder.Property(oc => oc.UpdatedDate).HasColumnName("UpdatedDate").IsRequired(false);
        builder.Property(oc => oc.DeletedDate).HasColumnName("DeletedDate").IsRequired(false);

        builder.Property(c => c.Name).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Role).IsRequired();
        builder.Property(c => c.Health).IsRequired().HasDefaultValue(100);
        builder.Property(c => c.Morale).IsRequired().HasDefaultValue(100);

        // Colony ile One-to-Many İlişkisi
        builder
            .HasOne(c => c.Colony)
            .WithMany(col => col.Colonists)
            .HasForeignKey(c => c.ColonyId)
            .OnDelete(DeleteBehavior.Cascade);

        // Building ile Opsiyonel İlişki (Bir kolonist boştaysa null olabilir)
        builder
            .HasOne(c => c.Building)
            .WithMany(b => b.WorkersList)
            .HasForeignKey(c => c.BuildingId)
            .OnDelete(DeleteBehavior.SetNull);

        // Soft Delete Filtresi
        builder.HasQueryFilter(c => !c.DeletedDate.HasValue);
    }
}
