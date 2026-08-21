using AutoMapper;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Common.Services;

namespace WalletUp.Application.Transaction.Commands.CreateTransaction;

public class CreateTransactionCommandHandler(
    IApplicationDbContext dbContext,
      IMapper mapper,
        IUserContext userContext)
     : IRequestHandler<CreateTransactionCommand, Result>
{
    public async Task<Result> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = mapper.Map<WalletUp.Domain.Entities.Transaction>(request);
        transaction.Date = transaction.Date.ToUniversalTime();
        dbContext.Transactions.Add(transaction);
        await dbContext.SaveChangesAsync(cancellationToken);
       return  Result.Success();
    }
}

