using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Colonies",
                columns: table => new
                {
                    Id = table
                        .Column<int>(type: "integer", nullable: false)
                        .Annotation(
                            "Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                        ),
                    Name = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: false
                    ),
                    Planet = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: false
                    ),
                    Description = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
                        nullable: false
                    ),
                    Commander = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: false
                    ),
                    Location = table.Column<string>(
                        type: "character varying(150)",
                        maxLength: 150,
                        nullable: false
                    ),
                    Stats_Sol = table.Column<int>(type: "integer", nullable: false),
                    Stats_Population = table.Column<int>(type: "integer", nullable: false),
                    Stats_MaxPopulation = table.Column<int>(type: "integer", nullable: false),
                    Stats_Power = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Stats_MaxPower = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Stats_Water = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Stats_MaxWater = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Stats_Oxygen = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Stats_MaxOxygen = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Stats_Food = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Stats_MaxFood = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Stats_Minerals = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Stats_Credits = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Stats_SafetyScore = table.Column<int>(type: "integer", nullable: false),
                    CreatedDate = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: false
                    ),
                    UpdatedDate = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                    DeletedDate = table.Column<DateTime>(
                        type: "timestamp with time zone",
                        nullable: true
                    ),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Colonies", x => x.Id);
                }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "Colonies");
        }
    }
}
