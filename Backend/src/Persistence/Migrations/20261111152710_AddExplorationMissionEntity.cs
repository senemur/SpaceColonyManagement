using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddExplorationMissionEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ExplorationMissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ColonyId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    TargetZone = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    RiskLevel = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    DurationInSols = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    RemainingSols = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    EnergyCost = table.Column<decimal>(type: "numeric(18,2)", nullable: false, defaultValue: 0m),
                    WaterCost = table.Column<decimal>(type: "numeric(18,2)", nullable: false, defaultValue: 0m),
                    CreditsCost = table.Column<decimal>(type: "numeric(18,2)", nullable: false, defaultValue: 0m),
                    RewardMinerals = table.Column<decimal>(type: "numeric(18,2)", nullable: false, defaultValue: 0m),
                    RewardWater = table.Column<decimal>(type: "numeric(18,2)", nullable: false, defaultValue: 0m),
                    RewardCredits = table.Column<decimal>(type: "numeric(18,2)", nullable: false, defaultValue: 0m),
                    RewardDescription = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    ResultSummary = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    StartSol = table.Column<int>(type: "integer", nullable: true),
                    CompletedSol = table.Column<int>(type: "integer", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExplorationMissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExplorationMissions_Colonies_ColonyId",
                        column: x => x.ColonyId,
                        principalTable: "Colonies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExplorationMissions_ColonyId",
                table: "ExplorationMissions",
                column: "ColonyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExplorationMissions");
        }
    }
}
