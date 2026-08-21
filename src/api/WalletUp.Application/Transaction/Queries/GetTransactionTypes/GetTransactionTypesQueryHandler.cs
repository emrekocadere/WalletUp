using AutoMapper;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Transaction.Dtos;

namespace WalletUp.Application.Transaction.Queries.GetTransactionTypes;

public class GetTransactionTypesQueryHandler(
    IMapper mapper,
    IApplicationDbContext dbContext)
    :IRequestHandler<GetTransactionTypesQuery,ResultT<ICollection<TransactionTypeDto>>>
{
    public Task<ResultT<ICollection<TransactionTypeDto>>> Handle(GetTransactionTypesQuery request, CancellationToken cancellationToken)
    {
        var transactionTypes = dbContext.TransactionTypes.ToList();
        var transactionTypeDtos = mapper.Map<List<TransactionTypeDto>>(transactionTypes);
        return Task.FromResult<ResultT<ICollection<TransactionTypeDto>>>(transactionTypeDtos);
    }
}