using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WalletUp.Application.Abstractions;
using RecurringTransactionEntity = WalletUp.Domain.Entities.RecurringTransaction;
using TransactionEntity = WalletUp.Domain.Entities.Transaction;

namespace WalletUp.Application.RecurringTransaction.Services;

public class RecurringTransactionProcessor(
    IApplicationDbContext dbContext,
    ILogger<RecurringTransactionProcessor> logger)
    : IRecurringTransactionProcessor
{
    public async Task<int> ProcessDueRecurringTransactionsAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var dueRecurringTransactions = await dbContext.RecurringTransactions
            .Include(x => x.Account)
            .Include(x => x.Category)
            .Include(x => x.TransactionType)
            .Where(x => x.IsActive && x.NextOccurrence <= now)
            .ToListAsync(cancellationToken);

        var createdCount = 0;
        foreach (var recurring in dueRecurringTransactions)
        {
            createdCount += await CatchUpAsync(recurring, now);
        }

        if (createdCount > 0)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        logger.LogInformation("Recurring transaction processing complete: {CreatedCount} transaction(s) created", createdCount);

        return createdCount;
    }

    public async Task<int> ProcessRecurringTransactionAsync(Guid recurringTransactionId, CancellationToken cancellationToken = default)
    {
        var recurring = await dbContext.RecurringTransactions.FindAsync(new object[] { recurringTransactionId }, cancellationToken);
        if (recurring is null)
        {
            return 0;
        }

        var createdCount = await CatchUpAsync(recurring, DateTime.UtcNow);
        if (createdCount > 0)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return createdCount;
    }

    private async Task<int> CatchUpAsync(RecurringTransactionEntity recurring, DateTime now)
    {
        var createdCount = 0;

        while (recurring.IsActive && recurring.NextOccurrence <= now)
        {
            var transaction = new TransactionEntity
            {
                AccountId = recurring.AccountId,
                CategoryId = recurring.CategoryId,
                TransactionTypeId = recurring.TransactionTypeId,
                Amount = recurring.Amount,
                Title = recurring.Title,
                Description = recurring.Description,
                Date = recurring.NextOccurrence,
            };

            dbContext.Transactions.Add(transaction);
            createdCount++;

            var nextOccurrence = recurring.AdvanceOccurrence(recurring.NextOccurrence);
            recurring.NextOccurrence = nextOccurrence;

            if (recurring.EndDate.HasValue && nextOccurrence > recurring.EndDate.Value)
            {
                recurring.IsActive = false;
            }
        }

        return createdCount;
    }
}
