using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Account.Dtos;
using WalletUp.Application.Common.Services;

namespace WalletUp.Application.Account.Queries.GetAccounts;

public class GetAccountsQueryHandler(
    IMapper mapper,
    IApplicationDbContext dbContext,
    IUserContext userContext,
    IExchangeRateService exchangeRateService)
    :IRequestHandler<GetAccountsQuery,ResultT<GetAccountsResponse>>
{
    public async Task<ResultT<GetAccountsResponse>> Handle(GetAccountsQuery request, CancellationToken cancellationToken)
    {
        var userId = userContext.UserId;
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

        var accountDtos = mapper.Map<List<AccountDto>>(accounts);
        foreach (var accountDto in accountDtos)
        {
            accountDto.Balance = accounts.First(a => a.Id == accountDto.Id).InitialBalance
                + netAmountsByAccountId.GetValueOrDefault(accountDto.Id);
        }

        var preferredCurrency = await dbContext.Preferences
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .Select(x => x.Currency.ISO4217Code)
            .FirstOrDefaultAsync(cancellationToken);

        double totalBalanceBasedOnPreferredCurrency = 0;
        foreach (var accountDto in accountDtos)
        {
            // The exchange API rejects amount < 1, so fetch the conversion factor with a fixed
            // amount of 1 and apply it locally instead of passing the (possibly 0/negative/<1) balance.
            var rate = accountDto.Currency.Iso4217Code == preferredCurrency
                ? 1d
                : (await exchangeRateService.GetRatesAsync($"{accountDto.Currency.Iso4217Code}{preferredCurrency}", 1)).Value;

            totalBalanceBasedOnPreferredCurrency += accountDto.Balance * rate;
        }

        return new GetAccountsResponse
        {
            Accounts = accountDtos,
            TotalBalanceBasedOnPreferredCurrency = totalBalanceBasedOnPreferredCurrency,
            AccountCount = accountDtos.Count,
            PreferredCurrency = preferredCurrency
        };
    }
}