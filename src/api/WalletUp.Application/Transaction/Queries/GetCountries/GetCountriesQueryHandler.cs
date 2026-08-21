using AutoMapper;
using MediatR;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Transaction.Dtos;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Transaction.Queries.GetCountries;

public class GetCountriesQueryHandler(
    IMapper mapper,
    IApplicationDbContext dbContext)
    : IRequestHandler<GetCountriesQuery, ResultT<List<CountryDto>>>
{
    public async Task<ResultT<List<CountryDto>>> Handle(GetCountriesQuery request, CancellationToken cancellationToken)
    {
        var countries = dbContext.Countries.ToList();
        var countryDtos = mapper.Map<List<CountryDto>>(countries);
        return countryDtos;
    }
}