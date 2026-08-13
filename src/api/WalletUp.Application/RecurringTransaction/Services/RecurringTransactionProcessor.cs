using Microsoft.Extensions.Logging;
using WalletUp.Domain.Repositories;
using TransactionEntity = WalletUp.Domain.Entities.Transaction;

namespace WalletUp.Application.RecurringTransaction.Services;

public class RecurringTransactionProcessor(
    IRecurringTransactionRepository recurringTransactionRepository,
    IRepository<TransactionEntity> transactionRepository,
    ILogger<RecurringTransactionProcessor> logger)
    : IRecurringTransactionProcessor
{
    public async Task<int> ProcessDueRecurringTransactionsAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var dueRecurringTransactions = recurringTransactionRepository.GetDueRecurringTransactions(now);

        var createdCount = 0;

        foreach (var recurring in dueRecurringTransactions)
        {
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

                await transactionRepository.Create(transaction);
                createdCount++;

                var nextOccurrence = recurring.AdvanceOccurrence(recurring.NextOccurrence);
                recurring.NextOccurrence = nextOccurrence;

                if (recurring.EndDate.HasValue && nextOccurrence > recurring.EndDate.Value)
                {
                    recurring.IsActive = false;
                }
            }
        }

        if (createdCount > 0)
        {
            await recurringTransactionRepository.SaveChanges();
        }

        logger.LogInformation("Recurring transaction processing complete: {CreatedCount} transaction(s) created", createdCount);

        return createdCount;
    }
}
