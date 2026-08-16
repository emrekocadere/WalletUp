using MediatR;
using WalletUp.Application.Common.Services;
using WalletUp.Application.RecurringTransaction.Services;
using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;

namespace WalletUp.Application.RecurringTransaction.Commands.UpdateRecurringTransaction;

public class UpdateRecurringTransactionCommandHandler(
    IRecurringTransactionRepository recurringTransactionRepository,
    IRecurringTransactionProcessor recurringTransactionProcessor,
    IUserContext userContext)
    : IRequestHandler<UpdateRecurringTransactionCommand, Result>
{
    public async Task<Result> Handle(UpdateRecurringTransactionCommand request, CancellationToken cancellationToken)
    {
        var recurringTransaction = await recurringTransactionRepository.GetByIdForUserAsync(request.Id, userContext.UserId);
        if (recurringTransaction is null)
        {
            return Errors.AccountNotFound;
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

        await recurringTransactionRepository.SaveChanges();

        if (startDateChanged)
        {
            await recurringTransactionProcessor.ProcessRecurringTransactionAsync(recurringTransaction.Id, cancellationToken);
        }

        return Result.Success();
    }
}
