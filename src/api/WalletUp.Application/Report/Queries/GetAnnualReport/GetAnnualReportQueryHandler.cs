using MediatR;
using Microsoft.EntityFrameworkCore;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Common.Services;
using WalletUp.Application.Report.Dtos;
using WalletUp.Application.Transaction.Dtos;
using WalletUp.Domain.Common;
using TransactionEntity = WalletUp.Domain.Entities.Transaction;

namespace WalletUp.Application.Report.Queries.GetAnnualReport;

public class GetAnnualReportQueryHandler(
    IUserContext userContext,
    IApplicationDbContext dbContext,
    IExchangeRateService exchangeRateService)
    : IRequestHandler<GetAnnualReportQuery, ResultT<AnnualReportDto>>
{
    private const int MinimumSupportedYear = 2000;

    public async Task<ResultT<AnnualReportDto>> Handle(GetAnnualReportQuery request, CancellationToken cancellationToken)
    {
        if (request.Year < MinimumSupportedYear || request.Year > DateTime.UtcNow.Year + 1)
        {
            return Errors.InvalidReportRequest;
        }

        var userId = userContext.UserId;
        var preferredCurrency = await dbContext.Preferences
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .Select(x => x.Currency.ISO4217Code)
            .FirstOrDefaultAsync(cancellationToken);

        var yearStart = new DateTime(request.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var yearEnd = yearStart.AddYears(1).AddTicks(-1);

        var transactions = await dbContext.Transactions
            .AsNoTracking()
            .Include(x => x.Account)
                .ThenInclude(a => a!.Currency)
            .Include(x => x.TransactionType)
            .Include(x => x.Category)
            .Where(x => x.Account!.UserId == userId && x.Date >= yearStart && x.Date <= yearEnd)
            .ToListAsync(cancellationToken);
        var conversionFactors = await BuildConversionFactorsAsync(transactions, preferredCurrency);

        var months = Enumerable.Range(1, 12)
            .Select(month => BuildMonthlyReport(month, transactions, conversionFactors))
            .ToList();

        return new AnnualReportDto
        {
            Year = request.Year,
            PreferredCurrency = preferredCurrency,
            Months = months
        };
    }

    private async Task<IReadOnlyDictionary<string, double>> BuildConversionFactorsAsync(
        ICollection<TransactionEntity> transactions,
        string preferredCurrency)
    {
        var distinctCurrencies = transactions
            .Select(t => t.Account!.Currency!.ISO4217Code)
            .Distinct();

        var factors = new Dictionary<string, double>();
        foreach (var currency in distinctCurrencies)
        {
            if (currency == preferredCurrency)
            {
                factors[currency] = 1d;
                continue;
            }

            var rate = await exchangeRateService.GetRatesAsync(currency + preferredCurrency, 1);
            factors[currency] = rate.Value;
        }

        return factors;
    }

    private static MonthlyReportDto BuildMonthlyReport(
        int month,
        ICollection<TransactionEntity> transactions,
        IReadOnlyDictionary<string, double> conversionFactors)
    {
        var monthTransactions = transactions.Where(t => t.Date.Month == month).ToList();

        double ConvertToPreferredCurrency(TransactionEntity transaction) =>
            transaction.Amount * conversionFactors[transaction.Account!.Currency!.ISO4217Code];

        var income = monthTransactions
            .Where(t => t.TransactionType!.Name == "income")
            .Sum(ConvertToPreferredCurrency);

        var expenseTransactions = monthTransactions
            .Where(t => t.TransactionType!.Name == "expense")
            .ToList();

        var expense = expenseTransactions.Sum(ConvertToPreferredCurrency);

        var categoryExpenses = expenseTransactions
            .GroupBy(t => new { t.CategoryId, t.Category!.Name })
            .Select(g => new CategoryExpenseDto
            {
                CategoryId = g.Key.CategoryId,
                CategoryName = g.Key.Name,
                Amount = Math.Round(g.Sum(ConvertToPreferredCurrency), 2),
                Percentage = 0
            })
            .OrderByDescending(c => c.Amount)
            .ToList();

        if (expense > 0)
        {
            foreach (var categoryExpense in categoryExpenses)
            {
                categoryExpense.Percentage = Math.Round(categoryExpense.Amount / expense * 100, 2);
            }
        }

        return new MonthlyReportDto
        {
            Month = month,
            Income = Math.Round(income, 2),
            Expense = Math.Round(expense, 2),
            TransactionQuantity = monthTransactions.Count,
            CategoryExpenses = categoryExpenses
        };
    }
}
