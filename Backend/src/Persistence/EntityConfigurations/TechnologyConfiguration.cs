namespace Persistence.EntityConfigurations;

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class TechnologyConfiguration : IEntityTypeConfiguration<Technology>
{
    public void Configure(EntityTypeBuilder<Technology> builder)
    {
        builder.ToTable("Technologies");
        builder.HasKey(t => t.Id);

        builder.Property(t => t.CreatedDate).HasColumnName("CreatedDate").IsRequired();
        builder.Property(t => t.UpdatedDate).HasColumnName("UpdatedDate").IsRequired(false);
        builder.Property(t => t.DeletedDate).HasColumnName("DeletedDate").IsRequired(false);

        builder.Property(t => t.Code).IsRequired().HasMaxLength(50);
        builder.Property(t => t.Name).IsRequired().HasMaxLength(150);
        builder.Property(t => t.Description).HasMaxLength(500);
        builder.Property(t => t.Category).IsRequired();
        builder.Property(t => t.MineralCost).HasColumnType("decimal(18,2)").IsRequired().HasDefaultValue(0);
        builder.Property(t => t.CreditCost).HasColumnType("decimal(18,2)").IsRequired().HasDefaultValue(0);
        builder.Property(t => t.DurationInSols).IsRequired().HasDefaultValue(2);
        builder.Property(t => t.Progress).HasColumnType("decimal(5,2)").IsRequired().HasDefaultValue(0);
        builder.Property(t => t.Status).IsRequired();
        builder.Property(t => t.PrerequisiteCode).HasMaxLength(50).IsRequired(false);
        builder.Property(t => t.BonusType).IsRequired();
        builder.Property(t => t.BonusValue).HasColumnType("decimal(18,2)").IsRequired().HasDefaultValue(0);

        builder
            .HasOne(t => t.Colony)
            .WithMany(c => c.Technologies)
            .HasForeignKey(t => t.ColonyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(t => !t.DeletedDate.HasValue);
    }
}
