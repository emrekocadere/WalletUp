using WalletUp.Domain.Entities;
using WalletUp.Infstructre.Identity.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CashCat.Infstructre.Persistence;

public class CashCatDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid,
    IdentityUserClaim<Guid>, IdentityUserRole<Guid>, IdentityUserLogin<Guid>,
    IdentityRoleClaim<Guid>, ApplicationUserToken>
{
    public CashCatDbContext(DbContextOptions<CashCatDbContext> options) :
        base(options) // buna bak meslela program.cs teki service.addbbcontext i silsem migratiopn olut mu veya derlenirmi
    {
    }

    public DbSet<Preference> Preferences { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<AccountType> AccountTypes { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<TransactionType> TransactionTypes { get; set; }
    public DbSet<Currency> Currencies { get; set; }
    public DbSet<Goal>Goals { get; set; }
    public DbSet<GoalTransaction> GoalTransactions{ get; set; }
    public DbSet<Country> Countries{ get; set; }
    public DbSet<ChatMessage> ChatMessage{ get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Apply IEntityTypeConfiguration implementations in this assembly
        builder.ApplyConfigurationsFromAssembly(typeof(CashCatDbContext).Assembly);

        // Additional explicit mapping (if needed) can go here
        // e.g. configure Identity table names or keys if you want to customize
    }
}