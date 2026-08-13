using WalletUp.Domain.Entities;
using WalletUp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;


namespace CashCat.Infstructre.Persistence.Repositories;

public class TransactionRepository : Repository<Transaction>, ITransactionRepository
{
    public TransactionRepository(CashCatDbContext context) : base(context)
    {
    }
    
    public ICollection<Transaction> GetTransactions(
        Guid userId,
        Guid? categoryId = null,
        Guid? transactionTypeId = null,
        Guid? accountId = null,
        DateTime? startDate = null,
        DateTime? endDate = null)
    {
        var query = _dbSet
            .AsNoTracking()
            .Include(x => x.Account)
            .Where(x => x.Account.UserId == userId)
            .Include(x => x.TransactionType)
            .Include(x => x.Category)
            .AsQueryable();
        
        if (categoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == categoryId.Value);
        }

        if (transactionTypeId.HasValue)
        {
            query = query.Where(x => x.TransactionTypeId == transactionTypeId.Value);
        }

        if (accountId.HasValue)
        {
            query = query.Where(x => x.AccountId == accountId.Value);
        }

        if (startDate.HasValue)
        {
            query = query.Where(x => x.Date >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(x => x.Date <= endDate.Value);
        }

        return query.ToList();
    }

    public int GetTransactionQuantityByMonths(Guid userId,int year,int month)
    {
        return _dbSet
            .AsNoTracking()
            .Include(x=>x.Account)
            .Count(x => x.Account.UserId == userId && x.Date.Year==year && x.Date.Month==month);
    }

    public double GetIncomesByMonths(Guid userId, int year, int month)
    {
        return _dbSet
            .AsNoTracking()
            .Include(x=>x.Account)
            .Include(x=>x.TransactionType)
            .Where(x=>x.Account.UserId==userId && x.TransactionType.Name=="income" && x.Date.Year==year && x.Date.Month==month)
            .Sum(x=>x.Amount);
    }

    public double GetExpenseAmountByMonths(Guid userId, int year, int month)
    {
        return _dbSet
            .AsNoTracking()
            .Include(x=>x.Account)
            .Include(x=>x.TransactionType)
            .Where(x=>x.Account.UserId==userId && x.TransactionType.Name=="expense" && x.Date.Year==year && x.Date.Month==month)
            .Sum(x=>x.Amount);
    }

    public ICollection<Transaction> GetExpensesByMonths(Guid userId, int year, int month)
    {
        return _dbSet
            .AsNoTracking()
            .Include(x => x.Account)
            .Include(x=>x.Category)
            .Include(x => x.TransactionType)
            .Where(x => x.Account.UserId == userId && x.TransactionType.Name == "expense" && x.Date.Year==year && x.Date.Month == month)
            .ToList();
    }

    public double GetTotalBalanceByUser(Guid userId)
    {
        return _dbSet
            .AsNoTracking()
            .Include(x=>x.Account)
            .Include(x=>x.TransactionType)
            .Where(x=>x.Account.UserId == userId)
            .Sum(x=>x.TransactionType.Name=="income" ? x.Amount : -x.Amount);
    }

    public ICollection<Transaction> GetTransactionsForReport(Guid userId, DateTime startDate, DateTime endDate)
    {
        return _dbSet
            .AsNoTracking()
            .Include(x => x.Account)
                .ThenInclude(a => a!.Currency)
            .Include(x => x.TransactionType)
            .Include(x => x.Category)
            .Where(x => x.Account.UserId == userId && x.Date >= startDate && x.Date <= endDate)
            .ToList();
    }
}