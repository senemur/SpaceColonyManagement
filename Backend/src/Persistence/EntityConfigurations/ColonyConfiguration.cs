namespace Persistence.EntityConfigurations;

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ColonyConfiguration : IEntityTypeConfiguration<Colony>
{
    public void Configure(EntityTypeBuilder<Colony> builder)
    {
        builder.ToTable("Colonies");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100);
        builder.Property(c => c.Description)
            .HasMaxLength(500);
        builder.Property(c => c.Commander)
            .IsRequired()
            .HasMaxLength(100);
        builder.Property(c => c.Planet)
            .IsRequired()
            .HasMaxLength(100);
        builder.Property(c => c.Location)
            .IsRequired()
            .HasMaxLength(150);

        builder.OwnsOne(c => c.Stats, statsBuilder =>
        {
            statsBuilder.Property(s => s.Sol).HasColumnName("Stats_Sol");
            statsBuilder.Property(s => s.Population).HasColumnName("Stats_Population");
            statsBuilder.Property(s => s.MaxPopulation).HasColumnName("Stats_MaxPopulation");
            
            statsBuilder.Property(s => s.Power).HasColumnType("decimal(18,2)").HasColumnName("Stats_Power");
            statsBuilder.Property(s => s.MaxPower).HasColumnType("decimal(18,2)").HasColumnName("Stats_MaxPower");
            
            statsBuilder.Property(s => s.Oxygen).HasColumnType("decimal(18,2)").HasColumnName("Stats_Oxygen");
            statsBuilder.Property(s => s.MaxOxygen).HasColumnType("decimal(18,2)").HasColumnName("Stats_MaxOxygen");
            
            statsBuilder.Property(s => s.Water).HasColumnType("decimal(18,2)").HasColumnName("Stats_Water");
            statsBuilder.Property(s => s.MaxWater).HasColumnType("decimal(18,2)").HasColumnName("Stats_MaxWater");
            
            statsBuilder.Property(s => s.Food).HasColumnType("decimal(18,2)").HasColumnName("Stats_Food");
            statsBuilder.Property(s => s.MaxFood).HasColumnType("decimal(18,2)").HasColumnName("Stats_MaxFood");
            
            statsBuilder.Property(s => s.Minerals).HasColumnType("decimal(18,2)").HasColumnName("Stats_Minerals");
            statsBuilder.Property(s => s.Credits).HasColumnType("decimal(18,2)").HasColumnName("Stats_Credits");
            
            statsBuilder.Property(s => s.SafetyScore).HasColumnName("Stats_SafetyScore");
        });
    }
}