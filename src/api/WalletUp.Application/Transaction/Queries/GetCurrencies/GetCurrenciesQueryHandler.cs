using AutoMapper;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Transaction.Dtos;

namespace WalletUp.Application.Transaction.Queries.GetCurrencies;

public class GetCurrenciesQueryHandler(
    IMapper mapper,
    IApplicationDbContext dbContext)
    : IRequestHandler<GetCurrenciesQuery,ResultT<ICollection<CurrencyDto>>>
{
    public Task<ResultT<ICollection<CurrencyDto>>> Handle(GetCurrenciesQuery request, CancellationToken cancellationToken)
    {
       var currencies= dbContext.Currencies.ToList();
        var currencyDtos=mapper.Map<List<CurrencyDto>>(currencies);
        return Task.FromResult<ResultT<ICollection<CurrencyDto>>>(currencyDtos);
    }
}