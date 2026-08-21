using Microsoft.EntityFrameworkCore;

namespace WalletUp.Application.Abstractions;

public interface IApplicationDbContext
{
    DbSet<WalletUp.Domain.Entities.Preference> Preferences { get; }
    DbSet<WalletUp.Domain.Entities.Category> Categories { get; }
    DbSet<WalletUp.Domain.Entities.Account> Accounts { get; }
    DbSet<WalletUp.Domain.Entities.AccountType> AccountTypes { get; }
    DbSet<WalletUp.Domain.Entities.Transaction> Transactions { get; }
    DbSet<WalletUp.Domain.Entities.TransactionType> TransactionTypes { get; }
    DbSet<WalletUp.Domain.Entities.Currency> Currencies { get; }
    DbSet<WalletUp.Domain.Entities.Goal> Goals { get; }
    DbSet<WalletUp.Domain.Entities.GoalTransaction> GoalTransactions { get; }
    DbSet<WalletUp.Domain.Entities.Country> Countries { get; }
    DbSet<WalletUp.Domain.Entities.ChatMessage> ChatMessage { get; }
    DbSet<WalletUp.Domain.Entities.RecurringTransaction> RecurringTransactions { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
