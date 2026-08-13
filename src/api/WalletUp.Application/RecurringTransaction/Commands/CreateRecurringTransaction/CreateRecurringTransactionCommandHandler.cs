using AutoMapper;
using MediatR;
using WalletUp.Application.Common.Services;
using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;

namespace WalletUp.Application.RecurringTransaction.Commands.CreateRecurringTransaction;

public class CreateRecurringTransactionCommandHandler(
    IMapper mapper,
    IAccountRepository accountRepository,
    IRecurringTransactionRepository recurringTransactionRepository,
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

        return Result.Success();
    }
}
