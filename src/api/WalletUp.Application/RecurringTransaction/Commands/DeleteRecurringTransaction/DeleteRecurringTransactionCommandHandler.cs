using MediatR;
using Microsoft.EntityFrameworkCore;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Common.Services;
using WalletUp.Domain.Common;

namespace WalletUp.Application.RecurringTransaction.Commands.DeleteRecurringTransaction;

public class DeleteRecurringTransactionCommandHandler(
    IApplicationDbContext dbContext,
    IUserContext userContext)
    : IRequestHandler<DeleteRecurringTransactionCommand, Result>
{
    public async Task<Result> Handle(DeleteRecurringTransactionCommand request, CancellationToken cancellationToken)
    {
        var recurringTransaction = await dbContext.RecurringTransactions
            .Include(x => x.Account)
            .FirstOrDefaultAsync(x => x.Id == request.Id && x.Account!.UserId == userContext.UserId, cancellationToken);
        if (recurringTransaction is null)
        {
            return Errors.RecurringTransactionNotFound;
        }

        dbContext.RecurringTransactions.Remove(recurringTransaction);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
