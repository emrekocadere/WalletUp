using MediatR;
using Microsoft.EntityFrameworkCore;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Common.Services;
using WalletUp.Application.RecurringTransaction.Services;
using WalletUp.Domain.Common;

namespace WalletUp.Application.RecurringTransaction.Commands.ToggleRecurringTransactionActive;

public class ToggleRecurringTransactionActiveCommandHandler(
    IApplicationDbContext dbContext,
    IRecurringTransactionProcessor recurringTransactionProcessor,
    IUserContext userContext)
    : IRequestHandler<ToggleRecurringTransactionActiveCommand, Result>
{
    public async Task<Result> Handle(ToggleRecurringTransactionActiveCommand request, CancellationToken cancellationToken)
    {
        var recurringTransaction = await dbContext.RecurringTransactions
            .Include(x => x.Account)
            .FirstOrDefaultAsync(x => x.Id == request.Id && x.Account!.UserId == userContext.UserId, cancellationToken);
        if (recurringTransaction is null)
        {
            return Errors.RecurringTransactionNotFound;
        }

        recurringTransaction.IsActive = !recurringTransaction.IsActive;

        var today = DateTime.UtcNow.Date;
        if (recurringTransaction.IsActive && recurringTransaction.NextOccurrence < today)
        {
            recurringTransaction.NextOccurrence = today;
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        if (recurringTransaction.IsActive)
        {
            await recurringTransactionProcessor.ProcessRecurringTransactionAsync(recurringTransaction.Id, cancellationToken);
        }

        return Result.Success();
    }
}
