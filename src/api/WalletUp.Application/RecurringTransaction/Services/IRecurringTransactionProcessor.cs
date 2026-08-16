namespace WalletUp.Application.RecurringTransaction.Services;

public interface IRecurringTransactionProcessor
{
    Task<int> ProcessDueRecurringTransactionsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Immediately catches up a single recurring transaction if it's already due, instead of
    /// waiting for the next daily job run (e.g. right after it's created or reactivated with a
    /// start date of today or earlier).
    /// </summary>
    Task<int> ProcessRecurringTransactionAsync(Guid recurringTransactionId, CancellationToken cancellationToken = default);
}
