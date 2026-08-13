using MediatR;
using WalletUp.Application.Common.Services;
using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;

namespace WalletUp.Application.RecurringTransaction.Commands.ToggleRecurringTransactionActive;

public class ToggleRecurringTransactionActiveCommandHandler(
    IRecurringTransactionRepository recurringTransactionRepository,
    IUserContext userContext)
    : IRequestHandler<ToggleRecurringTransactionActiveCommand, Result>
{
    public async Task<Result> Handle(ToggleRecurringTransactionActiveCommand request, CancellationToken cancellationToken)
    {
        var recurringTransaction = await recurringTransactionRepository.GetByIdForUserAsync(request.Id, userContext.UserId);
        if (recurringTransaction is null)
        {
            return Errors.AccountNotFound;
        }

        recurringTransaction.IsActive = !recurringTransaction.IsActive;

        var today = DateTime.UtcNow.Date;
        if (recurringTransaction.IsActive && recurringTransaction.NextOccurrence < today)
        {
            recurringTransaction.NextOccurrence = today;
        }

        await recurringTransactionRepository.SaveChanges();

        return Result.Success();
    }
}
