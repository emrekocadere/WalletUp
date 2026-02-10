using CashCat.Infstructre.Refit;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;

namespace CashCat.Infstructre.Services;

public class ExchangeRateService(IExchangeApi exchangeRateApi):IExchangeRateService
{
    public async Task<ExchangeApiResponse> GetRatesAsync(string currencies,double amount)
    {
       var result= await exchangeRateApi.Convert(currencies,amount);
       return result;
    }
}