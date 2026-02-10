using Refit;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;

namespace CashCat.Infstructre.Refit;

public interface IExchangeApi
{
    [Get("/api/currencyconverter/exchange")]
    Task<ExchangeApiResponse> Convert([Query]  string currencies, [Query] double  amount);

}