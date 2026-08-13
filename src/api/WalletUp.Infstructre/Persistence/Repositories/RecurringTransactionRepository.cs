using WalletUp.Domain.Entities;
using WalletUp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CashCat.Infstructre.Persistence.Repositories;

public class RecurringTransactionRepository : Repository<RecurringTransaction>, IRecurringTransactionRepository
{
    public RecurringTransactionRepository(CashCatDbContext context) : base(context)
    {
    }

    public ICollection<RecurringTransaction> GetAllByUserId(Guid userId)
    {
        return _dbSet
            .AsNoTracking()
            .Include(x => x.Account)
            .Include(x => x.Category)
            .Include(x => x.TransactionType)
            .Where(x => x.Account!.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToList();
    }

    public async Task<RecurringTransaction?> GetByIdForUserAsync(Guid id, Guid userId)
    {
        return await _dbSet
            .Include(x => x.Account)
            .FirstOrDefaultAsync(x => x.Id == id && x.Account!.UserId == userId);
    }

    public ICollection<RecurringTransaction> GetDueRecurringTransactions(DateTime asOfUtc)
    {
        return _dbSet
            .Include(x => x.Account)
            .Include(x => x.Category)
            .Include(x => x.TransactionType)
            .Where(x => x.IsActive && x.NextOccurrence <= asOfUtc)
            .ToList();
    }
}
