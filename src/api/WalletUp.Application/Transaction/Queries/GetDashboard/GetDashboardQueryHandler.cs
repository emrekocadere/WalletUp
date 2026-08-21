using Microsoft.EntityFrameworkCore;
using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Common.Services;
using WalletUp.Application.Transaction.Dtos;

namespace WalletUp.Application.Transaction.Queries.GetDashboard;

public class GetDashboardQueryHandler(
    IUserContext userContext,
    IApplicationDbContext dbContext,
    IExchangeRateService exchangeRateService)
    :IRequestHandler<GetDashboardQuery, ResultT<TransactionDashboardDto>>
{
    public async Task<ResultT<TransactionDashboardDto>> Handle(GetDashboardQuery request, CancellationToken cancellationToken)
    {
        var userId = userContext.UserId;
        var year = request.Year ?? DateTime.UtcNow.Year;

        var expenses = await dbContext.Transactions
            .AsNoTracking()
            .Include(x => x.Account)
            .Include(x => x.Category)
            .Include(x => x.TransactionType)
            .Where(x => x.Account!.UserId == userId && x.TransactionType!.Name == "expense" && x.Date.Year == year && x.Date.Month == request.Month)
            .ToListAsync(cancellationToken);

        var transactionQuantity = await dbContext.Transactions
            .AsNoTracking()
            .Include(x => x.Account)
            .CountAsync(x => x.Account!.UserId == userId && x.Date.Year == year && x.Date.Month == request.Month, cancellationToken);

        var ıncomeAmount = await dbContext.Transactions
            .AsNoTracking()
            .Include(x => x.Account)
            .Include(x => x.TransactionType)
            .Where(x => x.Account!.UserId == userId && x.TransactionType!.Name == "income" && x.Date.Year == year && x.Date.Month == request.Month)
            .SumAsync(x => x.Amount, cancellationToken);

        var expenseAmount = expenses.Sum(e => e.Amount);

        var goalQuantity = await dbContext.Goals
            .AsNoTracking()
            .CountAsync(g => g.UserId == userId, cancellationToken);

        double currentTotalBalance = 0;
        var accounts = await dbContext.Accounts
            .Where(x => x.UserId == userId)
            .Include(x => x.AccountType)
            .Include(x => x.Currency)
            .ToListAsync(cancellationToken);

        var netAmountsByAccountId = await dbContext.Transactions
            .AsNoTracking()
            .Include(x => x.Account)
            .Include(x => x.TransactionType)
            .Where(x => x.Account!.UserId == userId)
            .GroupBy(x => x.AccountId)
            .Select(g => new
            {
                AccountId = g.Key,
                Net = g.Sum(x => x.TransactionType!.Name == "income" ? x.Amount : -x.Amount)
            })
            .ToDictionaryAsync(x => x.AccountId, x => x.Net, cancellationToken);

        var preferredCurrency = await dbContext.Preferences
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .Select(x => x.Currency.ISO4217Code)
            .FirstOrDefaultAsync(cancellationToken);

        foreach (var account in accounts)
        {
            var currency = account.Currency!.ISO4217Code;
            var balance = account.InitialBalance + netAmountsByAccountId.GetValueOrDefault(account.Id);

            // The exchange API rejects amount < 1, so fetch the conversion factor with a fixed
            // amount of 1 and apply it locally instead of passing the (possibly 0/negative/<1) balance.
            var rate = currency == preferredCurrency
                ? 1d
                : (await exchangeRateService.GetRatesAsync(currency + preferredCurrency, 1)).Value;

            currentTotalBalance += balance * rate;
        }
        
        
        var categoryExpenses = expenses
            .GroupBy(e => new { e.CategoryId, e.Category!.Name })
            .Select(g => new CategoryExpenseDto
            {
                CategoryId = g.Key.CategoryId,
                CategoryName = g.Key.Name,
                Amount = g.Sum(e => e.Amount),
                Percentage = 0
            })
            .ToList();
        
        if (expenseAmount > 0)
        {
            foreach (var categoryExpense in categoryExpenses)
            {
                categoryExpense.Percentage = Math.Round((categoryExpense.Amount / expenseAmount) * 100, 2);
            }
        }

        TransactionDashboardDto dto = new()
        {
            Quantity = transactionQuantity,
            Income = ıncomeAmount,
            Expense = expenseAmount,
            CategoryExpenses = categoryExpenses,
            GoalQuantity = goalQuantity,
            CurrentTotalBalance = currentTotalBalance,
            PreferredCurrency= preferredCurrency
        };

        return dto;

    }
}