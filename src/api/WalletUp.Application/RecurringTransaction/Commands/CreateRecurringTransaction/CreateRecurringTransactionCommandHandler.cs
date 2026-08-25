using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Common.Services;
using WalletUp.Application.RecurringTransaction.Services;
using WalletUp.Domain.Common;

namespace WalletUp.Application.RecurringTransaction.Commands.CreateRecurringTransaction;

public class CreateRecurringTransactionCommandHandler(
    IMapper mapper,
    IApplicationDbContext dbContext,
    IRecurringTransactionProcessor recurringTransactionProcessor,
    IUserContext userContext)
    : IRequestHandler<CreateRecurringTransactionCommand, Result>
{
    public async Task<Result> Handle(CreateRecurringTransactionCommand request, CancellationToken cancellationToken)
    {
        var account = await dbContext.Accounts
            .Include(x => x.AccountType)
            .Include(x => x.Currency)
            .FirstOrDefaultAsync(x => x.Id == request.AccountId, cancellationToken);
        if (account is null || account.UserId != userContext.UserId)
        {
            return Errors.NotFound("Account");
        }

        var recurringTransaction = mapper.Map<Domain.Entities.RecurringTransaction>(request);
        recurringTransaction.StartDate = request.StartDate.ToUniversalTime();
        recurringTransaction.EndDate = request.EndDate?.ToUniversalTime();
        recurringTransaction.NextOccurrence = recurringTransaction.StartDate;

        dbContext.RecurringTransactions.Add(recurringTransaction);
        await dbContext.SaveChangesAsync(cancellationToken);

        // If the start date is today or earlier, don't make the user wait for tomorrow's job run.
        await recurringTransactionProcessor.ProcessRecurringTransactionAsync(recurringTransaction.Id, cancellationToken);

        return Result.Success();
    }
}
