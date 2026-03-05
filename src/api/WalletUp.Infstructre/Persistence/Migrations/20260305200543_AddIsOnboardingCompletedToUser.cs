using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CashCat.Infstructre.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIsOnboardingCompletedToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsOnboardingCompleted",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsOnboardingCompleted",
                table: "AspNetUsers");
        }
    }
}
