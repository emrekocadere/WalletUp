using MediatR;
using WalletUp.Application.Common.Services;
using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;

namespace WalletUp.Application.RecurringTransaction.Commands.DeleteRecurringTransaction;

public class DeleteRecurringTransactionCommandHandler(
    IRecurringTransactionRepository recurringTransactionRepository,
    IUserContext userContext)
    : IRequestHandler<DeleteRecurringTransactionCommand, Result>
{
    public async Task<Result> Handle(DeleteRecurringTransactionCommand request, CancellationToken cancellationToken)
    {
        var recurringTransaction = await recurringTransactionRepository.GetByIdForUserAsync(request.Id, userContext.UserId);
        if (recurringTransaction is null)
        {
            return Errors.AccountNotFound;
        }

        recurringTransactionRepository.Delete(recurringTransaction);
        await recurringTransactionRepository.SaveChanges();

        return Result.Success();
    }
}
