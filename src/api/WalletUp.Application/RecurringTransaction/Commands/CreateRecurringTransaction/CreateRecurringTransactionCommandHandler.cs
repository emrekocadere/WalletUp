using AutoMapper;
using MediatR;
using WalletUp.Application.Common.Services;
using WalletUp.Application.RecurringTransaction.Services;
using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;

namespace WalletUp.Application.RecurringTransaction.Commands.CreateRecurringTransaction;

public class CreateRecurringTransactionCommandHandler(
    IMapper mapper,
    IAccountRepository accountRepository,
    IRecurringTransactionRepository recurringTransactionRepository,
    IRecurringTransactionProcessor recurringTransactionProcessor,
    IUserContext userContext)
    : IRequestHandler<CreateRecurringTransactionCommand, Result>
{
    public async Task<Result> Handle(CreateRecurringTransactionCommand request, CancellationToken cancellationToken)
    {
        var account = accountRepository.GetAccountById(request.AccountId);
        if (account is null || account.UserId != userContext.UserId)
        {
            return Errors.AccountNotFound;
        }

        var recurringTransaction = mapper.Map<Domain.Entities.RecurringTransaction>(request);
        recurringTransaction.StartDate = request.StartDate.ToUniversalTime();
        recurringTransaction.EndDate = request.EndDate?.ToUniversalTime();
        recurringTransaction.NextOccurrence = recurringTransaction.StartDate;

        await recurringTransactionRepository.Create(recurringTransaction);
        await recurringTransactionRepository.SaveChanges();

        // If the start date is today or earlier, don't make the user wait for tomorrow's job run.
        await recurringTransactionProcessor.ProcessRecurringTransactionAsync(recurringTransaction.Id, cancellationToken);

        return Result.Success();
    }
}
