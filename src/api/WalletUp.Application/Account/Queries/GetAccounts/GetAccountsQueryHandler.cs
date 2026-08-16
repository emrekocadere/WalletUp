using AutoMapper;
using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;
using MediatR;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Account.Dtos;
using WalletUp.Application.Common.Services;

namespace WalletUp.Application.Account.Queries.GetAccounts;

public class GetAccountsQueryHandler(
    IMapper mapper,
    IAccountRepository accountRepository,
    ITransactionRepository transactionRepository,
    IUserContext userContext,
    IExchangeRateService exchangeRateService,
    IPreferenceRepository preferenceRepository)
    :IRequestHandler<GetAccountsQuery,ResultT<GetAccountsResponse>>
{
    public async Task<ResultT<GetAccountsResponse>> Handle(GetAccountsQuery request, CancellationToken cancellationToken)
    {
        var userId = userContext.UserId;
        var accounts = accountRepository.GetAllAccountsByUserId(userId);
        var netAmountsByAccountId = transactionRepository.GetNetAmountsByAccountIds(userId);

        var accountDtos = mapper.Map<List<AccountDto>>(accounts);
        foreach (var accountDto in accountDtos)
        {
            accountDto.Balance = accounts.First(a => a.Id == accountDto.Id).InitialBalance
                + netAmountsByAccountId.GetValueOrDefault(accountDto.Id);
        }

        var preferredCurrency = preferenceRepository.GetPreferredCurrencyByUserId(userId);

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