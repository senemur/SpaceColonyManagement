namespace Persistence.Contexts.EntityConfigurations;

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class BuildingConfiguration : IEntityTypeConfiguration<Building>
{
    public void Configure(EntityTypeBuilder<Building> builder)
    {
        builder.ToTable("Buildings");
        builder.HasKey(b => b.Id);
        builder.Property(oc => oc.CreatedDate).HasColumnName("CreatedDate").IsRequired();
        builder.Property(oc => oc.UpdatedDate).HasColumnName("UpdatedDate").IsRequired(false);
        builder.Property(oc => oc.DeletedDate).HasColumnName("DeletedDate").IsRequired(false);

        builder.Property(b => b.Name).IsRequired().HasMaxLength(100);
        builder.Property(b => b.BuildingType).IsRequired();
        builder.Property(b => b.Level).IsRequired().HasDefaultValue(1);
        builder.Property(b => b.Health).IsRequired().HasDefaultValue(100);
        builder.Property(b => b.Workers).IsRequired().HasDefaultValue(0);
        builder.Property(b => b.MaxWorkers).IsRequired().HasDefaultValue(4);
        builder.Property(b => b.PowerConsumption).IsRequired().HasDefaultValue(0);
        builder.Property(b => b.PowerProduction).IsRequired().HasDefaultValue(0);
        builder.Property(b => b.IsActive).IsRequired().HasDefaultValue(true);

        builder
            .HasOne(b => b.Colony)
            .WithMany(c => c.Buildings)
            .HasForeignKey(b => b.ColonyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(b => !b.DeletedDate.HasValue);
    }
}
