using MediatR;
using Microsoft.EntityFrameworkCore;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Account.Dtos;
using WalletUp.Application.Common.Services;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Account.Commands.TransferMoney;

public class TransferMoneyCommandHandler(
    IApplicationDbContext dbContext,
    IExchangeRateService exchangeRateService,
    IUserContext userContext)
    : IRequestHandler<TransferMoneyCommand, ResultT<TransferMoneyResponse>>
{
    public async Task<ResultT<TransferMoneyResponse>> Handle(TransferMoneyCommand request, CancellationToken cancellationToken)
    {
        if (request.FromAccountId == request.ToAccountId)
            return Errors.SameAccountTransfer;

        if (request.Amount <= 0)
            return Errors.InvalidTransaction;

        var currentUserId = userContext.UserId;

        var fromAccount = await dbContext.Accounts
            .Include(x => x.Currency)
            .FirstOrDefaultAsync(x => x.Id == request.FromAccountId && x.UserId == currentUserId, cancellationToken);
        var toAccount = await dbContext.Accounts
            .Include(x => x.Currency)
            .FirstOrDefaultAsync(x => x.Id == request.ToAccountId && x.UserId == currentUserId, cancellationToken);

        if (fromAccount is null || toAccount is null)
            return Errors.NotFound("Account");

        var fromAccountNetAmount = await dbContext.Transactions
            .AsNoTracking()
            .Include(x => x.TransactionType)
            .Where(x => x.AccountId == fromAccount.Id)
            .SumAsync(x => x.TransactionType!.Name == "income" ? x.Amount : -x.Amount, cancellationToken);
        var fromAccountBalance = fromAccount.InitialBalance + fromAccountNetAmount;

        if (fromAccountBalance < request.Amount)
            return Errors.InsufficientFunds;

        var rate = 1d;
        if (fromAccount.CurrencyId != toAccount.CurrencyId)
        {
            var conversion = await exchangeRateService.GetRatesAsync(
                $"{fromAccount.Currency!.ISO4217Code}{toAccount.Currency!.ISO4217Code}", 1);

            if (!conversion.IsSuccess)
                return Errors.CurrencyConversionFailed;

            rate = conversion.Value;
        }

        var amountCredited = request.Amount * rate;

        var transferCategory = await dbContext.Categories.FirstOrDefaultAsync(x => x.Name == "Transfer", cancellationToken);
        var expenseType = await dbContext.TransactionTypes.FirstOrDefaultAsync(x => x.Name == "expense", cancellationToken);
        var incomeType = await dbContext.TransactionTypes.FirstOrDefaultAsync(x => x.Name == "income", cancellationToken);

        if (transferCategory is null || expenseType is null || incomeType is null)
            return Errors.UnexpectedError;

        var now = DateTime.UtcNow;

        dbContext.Transactions.Add(new Domain.Entities.Transaction
        {
            AccountId = fromAccount.Id,
            CategoryId = transferCategory.Id,
            TransactionTypeId = expenseType.Id,
            Amount = request.Amount,
            Title = "Transfer",
            Description = request.Description ?? $"Transfer to {toAccount.Name}",
            Date = now
        });

        dbContext.Transactions.Add(new Domain.Entities.Transaction
        {
            AccountId = toAccount.Id,
            CategoryId = transferCategory.Id,
            TransactionTypeId = incomeType.Id,
            Amount = amountCredited,
            Title = "Transfer",
            Description = request.Description ?? $"Transfer from {fromAccount.Name}",
            Date = now
        });

        await dbContext.SaveChangesAsync(cancellationToken);

        return new TransferMoneyResponse
        {
            FromAccountId = fromAccount.Id,
            ToAccountId = toAccount.Id,
            AmountDebited = request.Amount,
            AmountCredited = amountCredited,
            Rate = rate
        };
    }
}
