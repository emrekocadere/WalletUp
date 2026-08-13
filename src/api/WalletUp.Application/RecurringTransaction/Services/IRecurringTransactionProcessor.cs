namespace WalletUp.Application.RecurringTransaction.Services;

public interface IRecurringTransactionProcessor
{
    Task<int> ProcessDueRecurringTransactionsAsync(CancellationToken cancellationToken = default);
}
