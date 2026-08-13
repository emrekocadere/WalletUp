using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CashCat.Infstructre.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameAccountBalanceToInitialBalance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Balance",
                table: "Accounts",
                newName: "InitialBalance");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InitialBalance",
                table: "Accounts",
                newName: "Balance");
        }
    }
}
