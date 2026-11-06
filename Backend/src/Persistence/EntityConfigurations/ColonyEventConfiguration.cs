namespace Persistence.EntityConfigurations;

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ColonyEventConfiguration : IEntityTypeConfiguration<ColonyEvent>
{
    public void Configure(EntityTypeBuilder<ColonyEvent> builder)
    {
        builder.ToTable("ColonyEvents");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.CreatedDate).HasColumnName("CreatedDate").IsRequired();
        builder.Property(e => e.UpdatedDate).HasColumnName("UpdatedDate").IsRequired(false);
        builder.Property(e => e.DeletedDate).HasColumnName("DeletedDate").IsRequired(false);

        builder.Property(e => e.Sol).IsRequired();
        builder.Property(e => e.Title).IsRequired().HasMaxLength(150);
        builder.Property(e => e.Message).IsRequired().HasMaxLength(1000);
        builder.Property(e => e.Type).IsRequired();
        builder.Property(e => e.EffectType).IsRequired();
        builder.Property(e => e.EffectValue).HasColumnType("decimal(18,2)").IsRequired().HasDefaultValue(0);
        builder.Property(e => e.DurationInSols).IsRequired().HasDefaultValue(0);
        builder.Property(e => e.RemainingSols).IsRequired().HasDefaultValue(0);
        builder.Property(e => e.IsActive).IsRequired().HasDefaultValue(false);

        builder
            .HasOne(e => e.Colony)
            .WithMany(c => c.Events)
            .HasForeignKey(e => e.ColonyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(e => !e.DeletedDate.HasValue);
    }
}
