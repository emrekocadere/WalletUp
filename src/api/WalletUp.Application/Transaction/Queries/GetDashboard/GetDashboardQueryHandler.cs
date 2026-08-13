using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;
using MediatR;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Common.Services;
using WalletUp.Application.Transaction.Dtos;

namespace WalletUp.Application.Transaction.Queries.GetDashboard;

public class GetDashboardQueryHandler(
    IUserContext userContext,
    ITransactionRepository transactionRepository,
    IGoalRepository goalRepository,
    IAccountRepository accountRepository,
    IExchangeRateService exchangeRateService,
    IPreferenceRepository preferenceRepository)
    :IRequestHandler<GetDashboardQuery, ResultT<TransactionDashboardDto>>
{
    public async Task<ResultT<TransactionDashboardDto>> Handle(GetDashboardQuery request, CancellationToken cancellationToken)
    {
        var userId = userContext.UserId;
        var year = request.Year ?? DateTime.UtcNow.Year;
        var expenses = transactionRepository.GetExpensesByMonths(userId,year,request.Month);
        var transactionQuantity = transactionRepository.GetTransactionQuantityByMonths(userId,year,request.Month);
        var ıncomeAmount = transactionRepository.GetIncomesByMonths(userId,year,request.Month);
        var expenseAmount = expenses.Sum(e => e.Amount);
        var goalQuantity = goalRepository.GetGoalQuantityByUser(userId);
        double currentTotalBalance = 0;
        var accounts = accountRepository.GetAllAccountsByUserId(userId);
        var netAmountsByAccountId = transactionRepository.GetNetAmountsByAccountIds(userId);
        var preferredCurrency = preferenceRepository.GetPreferredCurrencyByUserId(userId);

        foreach (var account in accounts)
        {
            var currency = account.Currency!.ISO4217Code;
            var balance = account.InitialBalance + netAmountsByAccountId.GetValueOrDefault(account.Id);

            var converted = await exchangeRateService.GetRatesAsync(currency + preferredCurrency, balance);
            currentTotalBalance += converted.Value;
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