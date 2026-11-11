namespace Persistence.EntityConfigurations;

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ExplorationMissionConfiguration : IEntityTypeConfiguration<ExplorationMission>
{
    public void Configure(EntityTypeBuilder<ExplorationMission> builder)
    {
        builder.ToTable("ExplorationMissions");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.CreatedDate).HasColumnName("CreatedDate").IsRequired();
        builder.Property(e => e.UpdatedDate).HasColumnName("UpdatedDate").IsRequired(false);
        builder.Property(e => e.DeletedDate).HasColumnName("DeletedDate").IsRequired(false);

        builder.Property(e => e.Name).IsRequired().HasMaxLength(150);
        builder.Property(e => e.TargetZone).IsRequired().HasMaxLength(100);
        builder.Property(e => e.Description).HasMaxLength(500);
        builder.Property(e => e.RiskLevel).IsRequired();
        builder.Property(e => e.Status).IsRequired();
        builder.Property(e => e.DurationInSols).IsRequired().HasDefaultValue(1);
        builder.Property(e => e.RemainingSols).IsRequired().HasDefaultValue(1);

        builder.Property(e => e.EnergyCost).HasColumnType("decimal(18,2)").IsRequired().HasDefaultValue(0);
        builder.Property(e => e.WaterCost).HasColumnType("decimal(18,2)").IsRequired().HasDefaultValue(0);
        builder.Property(e => e.CreditsCost).HasColumnType("decimal(18,2)").IsRequired().HasDefaultValue(0);

        builder.Property(e => e.RewardMinerals).HasColumnType("decimal(18,2)").IsRequired().HasDefaultValue(0);
        builder.Property(e => e.RewardWater).HasColumnType("decimal(18,2)").IsRequired().HasDefaultValue(0);
        builder.Property(e => e.RewardCredits).HasColumnType("decimal(18,2)").IsRequired().HasDefaultValue(0);

        builder.Property(e => e.RewardDescription).HasMaxLength(300);
        builder.Property(e => e.ResultSummary).HasMaxLength(500);
        builder.Property(e => e.StartSol).IsRequired(false);
        builder.Property(e => e.CompletedSol).IsRequired(false);

        builder
            .HasOne(e => e.Colony)
            .WithMany(c => c.ExplorationMissions)
            .HasForeignKey(e => e.ColonyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(e => !e.DeletedDate.HasValue);
    }
}
