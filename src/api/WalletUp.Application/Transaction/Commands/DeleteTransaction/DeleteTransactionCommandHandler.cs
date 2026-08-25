using Microsoft.EntityFrameworkCore;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Common.Services;
using WalletUp.Domain.Common;
using MediatR;

namespace WalletUp.Application.Transaction.Commands.DeleteTransaction;

public class DeleteTransactionCommandHandler(
    IApplicationDbContext dbContext,
    IUserContext userContext)
    :IRequestHandler<DeleteTransactionCommand,Result>
{
    public async Task<Result> Handle(DeleteTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = await dbContext.Transactions
            .Include(x => x.Account)
            .FirstOrDefaultAsync(x => x.Id == request.TransactionId, cancellationToken);
        if (transaction is null)
            return Errors.NotFound("Transaction");

        if (!transaction.CanDelete(userContext.UserId))
            return Errors.Forbidden;

        dbContext.Transactions.Remove(transaction);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}