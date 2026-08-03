using CashCat.Infstructre.Refit;
using Microsoft.Extensions.Logging;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;

namespace CashCat.Infstructre.Services;

public class ExchangeRateService(IExchangeApi exchangeRateApi,ILogger<ExchangeRateService> logger):IExchangeRateService
{
    public async Task<ExchangeApiResponse> GetRatesAsync(string currencies,double amount)
    {
        logger.LogInformation($"Getting exchange rates for {currencies} - {amount}");
       var result= await exchangeRateApi.Convert(currencies,amount);
       logger.LogInformation($"Exchange rates retrieved: {result}");
       return result;
    }
}