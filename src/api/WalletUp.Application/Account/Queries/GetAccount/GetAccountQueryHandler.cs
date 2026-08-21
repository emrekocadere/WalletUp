using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Account.Dtos;

namespace WalletUp.Application.Account.Queries.GetAccount;

public class GetAccountQueryHandler(
    IMapper mapper,
    IApplicationDbContext dbContext)
    : IRequestHandler<GetAccountQuery, ResultT<AccountDto>>
{
    public async Task<ResultT<AccountDto>> Handle(GetAccountQuery request, CancellationToken cancellationToken)
    {
        var account = await dbContext.Accounts
            .Include(x => x.AccountType)
            .Include(x => x.Currency)
            .FirstOrDefaultAsync(x => x.Id == request.AccountId, cancellationToken);
        var accountDto = mapper.Map<AccountDto>(account);

        var netAmount = await dbContext.Transactions
            .AsNoTracking()
            .Include(x => x.TransactionType)
            .Where(x => x.AccountId == account.Id)
            .SumAsync(x => x.TransactionType!.Name == "income" ? x.Amount : -x.Amount, cancellationToken);

        accountDto.Balance = account.InitialBalance + netAmount;
        return accountDto;
    }
}