using AutoMapper;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Account.Dtos;

namespace WalletUp.Application.Account.Queries.GetAccountTypes;

public class GetAccountTypesQueryHandler(
    IMapper mapper,
    IApplicationDbContext dbContext)
    :IRequestHandler<GetAccountTypesQuery, ResultT<ICollection<AccountTypeDto>>>
{
    public Task<ResultT<ICollection<AccountTypeDto>>> Handle(GetAccountTypesQuery request, CancellationToken cancellationToken)
    {
        var accountTypes = dbContext.AccountTypes.ToList();
        var accountTypeDtos=mapper.Map<List<AccountTypeDto>>(accountTypes);
        return Task.FromResult<ResultT<ICollection<AccountTypeDto>>>(accountTypeDtos);
    }
}