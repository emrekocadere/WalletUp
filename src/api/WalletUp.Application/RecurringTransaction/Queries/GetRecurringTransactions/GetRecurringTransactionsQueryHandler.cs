using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Common.Services;
using WalletUp.Application.RecurringTransaction.Dtos;
using WalletUp.Domain.Common;

namespace WalletUp.Application.RecurringTransaction.Queries.GetRecurringTransactions;

public class GetRecurringTransactionsQueryHandler(
    IMapper mapper,
    IApplicationDbContext dbContext,
    IUserContext userContext)
    : IRequestHandler<GetRecurringTransactionsQuery, ResultT<ICollection<RecurringTransactionDto>>>
{
    public async Task<ResultT<ICollection<RecurringTransactionDto>>> Handle(GetRecurringTransactionsQuery request, CancellationToken cancellationToken)
    {
        var recurringTransactions = await dbContext.RecurringTransactions
            .AsNoTracking()
            .Include(x => x.Account)
            .Include(x => x.Category)
            .Include(x => x.TransactionType)
            .Where(x => x.Account!.UserId == userContext.UserId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
        var dtos = mapper.Map<List<RecurringTransactionDto>>(recurringTransactions);
        return dtos;
    }
}
