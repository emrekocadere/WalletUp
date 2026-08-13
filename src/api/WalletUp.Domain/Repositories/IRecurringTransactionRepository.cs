using WalletUp.Domain.Entities;

namespace WalletUp.Domain.Repositories;

public interface IRecurringTransactionRepository : IRepository<RecurringTransaction>
{
    ICollection<RecurringTransaction> GetAllByUserId(Guid userId);
    Task<RecurringTransaction?> GetByIdForUserAsync(Guid id, Guid userId);
    ICollection<RecurringTransaction> GetDueRecurringTransactions(DateTime asOfUtc);
}
