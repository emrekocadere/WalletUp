using AutoMapper;
using MediatR;
using WalletUp.Application.Common.Services;
using WalletUp.Application.RecurringTransaction.Dtos;
using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;

namespace WalletUp.Application.RecurringTransaction.Queries.GetRecurringTransactions;

public class GetRecurringTransactionsQueryHandler(
    IMapper mapper,
    IRecurringTransactionRepository recurringTransactionRepository,
    IUserContext userContext)
    : IRequestHandler<GetRecurringTransactionsQuery, ResultT<ICollection<RecurringTransactionDto>>>
{
    public Task<ResultT<ICollection<RecurringTransactionDto>>> Handle(GetRecurringTransactionsQuery request, CancellationToken cancellationToken)
    {
        var recurringTransactions = recurringTransactionRepository.GetAllByUserId(userContext.UserId);
        var dtos = mapper.Map<List<RecurringTransactionDto>>(recurringTransactions);
        return Task.FromResult<ResultT<ICollection<RecurringTransactionDto>>>(dtos);
    }
}
