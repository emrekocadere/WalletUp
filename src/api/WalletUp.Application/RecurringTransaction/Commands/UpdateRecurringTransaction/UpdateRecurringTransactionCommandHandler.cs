using MediatR;
using Microsoft.EntityFrameworkCore;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Common.Services;
using WalletUp.Application.RecurringTransaction.Services;
using WalletUp.Domain.Common;

namespace WalletUp.Application.RecurringTransaction.Commands.UpdateRecurringTransaction;

public class UpdateRecurringTransactionCommandHandler(
    IApplicationDbContext dbContext,
    IRecurringTransactionProcessor recurringTransactionProcessor,
    IUserContext userContext)
    : IRequestHandler<UpdateRecurringTransactionCommand, Result>
{
    public async Task<Result> Handle(UpdateRecurringTransactionCommand request, CancellationToken cancellationToken)
    {
        var recurringTransaction = await dbContext.RecurringTransactions
            .Include(x => x.Account)
            .FirstOrDefaultAsync(x => x.Id == request.Id && x.Account!.UserId == userContext.UserId, cancellationToken);
        if (recurringTransaction is null)
        {
            return Errors.RecurringTransactionNotFound;
        }

        var newStartDate = request.StartDate.ToUniversalTime();
        var startDateChanged = recurringTransaction.StartDate != newStartDate;

        recurringTransaction.Title = request.Title;
        recurringTransaction.Description = request.Description;
        recurringTransaction.Amount = request.Amount;
        recurringTransaction.CategoryId = request.CategoryId;
        recurringTransaction.TransactionTypeId = request.TransactionTypeId;
        recurringTransaction.Frequency = request.Frequency;
        recurringTransaction.StartDate = newStartDate;
        recurringTransaction.EndDate = request.EndDate?.ToUniversalTime();
        recurringTransaction.IsActive = request.IsActive;

        if (startDateChanged)
        {
            recurringTransaction.NextOccurrence = newStartDate;
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        if (startDateChanged)
        {
            await recurringTransactionProcessor.ProcessRecurringTransactionAsync(recurringTransaction.Id, cancellationToken);
        }

        return Result.Success();
    }
}
