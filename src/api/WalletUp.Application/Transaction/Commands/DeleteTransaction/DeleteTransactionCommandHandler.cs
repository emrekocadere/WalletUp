using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using MediatR;

namespace WalletUp.Application.Transaction.Commands.DeleteTransaction;

public class DeleteTransactionCommandHandler(
    IApplicationDbContext dbContext)
    :IRequestHandler<DeleteTransactionCommand,Result>
{
    public async Task<Result> Handle(DeleteTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = await dbContext.Transactions.FindAsync(new object[] { request.TransactionId }, cancellationToken);
        if (transaction is null)
            return Errors.TransactionNotFound;

        dbContext.Transactions.Remove(transaction);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}