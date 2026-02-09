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
    IUserContext userContext,
    IExchangeRateService exchangeRateService)
    :IRequestHandler<GetAccountsQuery,ResultT<GetAccountsResponse>>
{
    public async Task<ResultT<GetAccountsResponse>> Handle(GetAccountsQuery request, CancellationToken cancellationToken)
    {
        var accounts = accountRepository.GetAllAccountsByUserId(userContext.UserId);
        double totalBalanceBasedOnPreferredCurrency=0;
        var accountDtos = mapper.Map<List<AccountDto>>(accounts);
        foreach (var account in accounts)
        {
            var abc = await exchangeRateService.GetRatesAsync($"{account.Currency.ISO4217Code}USD", account.Balance);
            totalBalanceBasedOnPreferredCurrency += abc.Value;
        }
        var response = new GetAccountsResponse
        {
            Accounts = accountDtos,
            TotalBalanceBasedOnPreferredCurrency = totalBalanceBasedOnPreferredCurrency,
            AccountCount = accountDtos.Count
        };

        return response;

    }
    
}