using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CashCat.Infstructre.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DeleteSomeTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMessage_AspNetUsers_UserId",
                table: "ChatMessage");

            migrationBuilder.DropTable(
                name: "ChatSummary");

            migrationBuilder.DropIndex(
                name: "IX_ChatMessage_UserId",
                table: "ChatMessage");

            migrationBuilder.AddColumn<Guid>(
                name: "ApplicationUserId",
                table: "ChatMessage",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessage_ApplicationUserId",
                table: "ChatMessage",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMessage_AspNetUsers_ApplicationUserId",
                table: "ChatMessage",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMessage_AspNetUsers_ApplicationUserId",
                table: "ChatMessage");

            migrationBuilder.DropIndex(
                name: "IX_ChatMessage_ApplicationUserId",
                table: "ChatMessage");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "ChatMessage");

            migrationBuilder.CreateTable(
                name: "ChatSummary",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SummaryText = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatSummary", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_ChatSummary_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessage_UserId",
                table: "ChatMessage",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMessage_AspNetUsers_UserId",
                table: "ChatMessage",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
