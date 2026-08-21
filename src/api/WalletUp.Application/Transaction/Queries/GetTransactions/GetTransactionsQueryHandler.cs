using System;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Common.Services;
using WalletUp.Application.Transaction.Dtos;

namespace WalletUp.Application.Transaction.Queries.GetTransactions;

public class GetTransactionsQueryHandler(
    IMapper mapper,
    IApplicationDbContext dbContext,
    IUserContext userContext
)
: IRequestHandler<GetTransactionsQuery, ResultT<List<TransactionDto>>>
{
    public async Task<ResultT<List<TransactionDto>>> Handle(GetTransactionsQuery request, CancellationToken cancellationToken)
    {
        var query = dbContext.Transactions
            .AsNoTracking()
            .Include(x => x.Account)
            .Where(x => x.Account!.UserId == userContext.UserId)
            .Include(x => x.TransactionType)
            .Include(x => x.Category)
            .AsQueryable();

        if (request.CategoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == request.CategoryId.Value);
        }

        if (request.TransactionTypeId.HasValue)
        {
            query = query.Where(x => x.TransactionTypeId == request.TransactionTypeId.Value);
        }

        if (request.AccountId.HasValue)
        {
            query = query.Where(x => x.AccountId == request.AccountId.Value);
        }

        if (request.StartDate.HasValue)
        {
            query = query.Where(x => x.Date >= request.StartDate.Value);
        }

        if (request.EndDate.HasValue)
        {
            query = query.Where(x => x.Date <= request.EndDate.Value);
        }

        var transactions = await query.ToListAsync(cancellationToken);

        var transactionDtos = mapper.Map<List<TransactionDto>>(transactions);
        return transactionDtos;
    }
}