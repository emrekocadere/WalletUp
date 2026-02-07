using WalletUp.Domain.Common;

namespace WalletUp.Application.Abstractions;

public interface IExchangeRateService
{
    Task<ExchangeApiResponse> GetRatesAsync(string currencies, decimal amount);
}