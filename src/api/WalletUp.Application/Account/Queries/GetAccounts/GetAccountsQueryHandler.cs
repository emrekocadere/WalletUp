using AutoMapper;
using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Account.Dtos;
using WalletUp.Application.Common.Services;

namespace WalletUp.Application.Account.Queries.GetAccounts;

public class GetAccountsQueryHandler(
    IMapper mapper,
    ILogger<GetAccountsQueryHandler> logger,
    IAccountRepository accountRepository,
    IUserContext userContext,
    IExchangeRateService exchangeRateService,
    IPreferenceRepository preferenceRepository)
    :IRequestHandler<GetAccountsQuery,ResultT<GetAccountsResponse>>
{
    public async Task<ResultT<GetAccountsResponse>> Handle(GetAccountsQuery request, CancellationToken cancellationToken)
    {
   
        try
        {
            logger.LogInformation("Retrieving accounts for user {UserId}", userContext.UserId);
            var accounts = accountRepository.GetAllAccountsByUserId(userContext.UserId);
            logger.LogInformation("account count {UserId}", accounts.Count);
            foreach (var account in accounts)
            {
                logger.LogInformation("db hesap balance {UserId}", account.Balance);
            }
                
            double totalBalanceBasedOnPreferredCurrency=0;
            var accountDtos = mapper.Map<List<AccountDto>>(accounts);
            
            foreach (var account in accountDtos)
            {
                logger.LogInformation("dto hesap balance {UserId}", account.Balance);
            }
            
            var preferredCurrency = preferenceRepository.GetPreferredCurrencyByUserId(userContext.UserId);
            logger.LogInformation("Preferred currency for user {UserId} is {PreferredCurrency}", userContext.UserId, preferredCurrency);
            foreach (var account in accounts)
            {
                logger.LogInformation("account.Currency {UserId}", account.Balance);
                if (account.Balance <= 0)
                {
                    continue;
                }
                var abc = await exchangeRateService.GetRatesAsync($"{account.Currency.ISO4217Code}{preferredCurrency}", account.Balance);
                totalBalanceBasedOnPreferredCurrency += abc.Value;
            }
            var response = new GetAccountsResponse
            {
                Accounts = accountDtos,
                TotalBalanceBasedOnPreferredCurrency = totalBalanceBasedOnPreferredCurrency,
                AccountCount = accountDtos.Count,
                PreferredCurrency = preferredCurrency
            };

            logger.LogInformation("Successfully retrieved accounts for user {UserId}", userContext.UserId);
            return response;
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message, "An error occurred while retrieving accounts for user {UserId}", userContext.UserId);
           
        }
        var response2= new GetAccountsResponse()
        {
           PreferredCurrency="asd"
        };
        return response2;
    }
    
}