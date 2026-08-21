using Microsoft.EntityFrameworkCore;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Common.Services;

namespace WalletUp.Application.Account.Commands.DeleteAccount;

public class DeleteAccountCommandHandler(
    IApplicationDbContext dbContext,
    IUserContext userContext)
    : IRequestHandler<DeleteAccountCommand, Result>
{
    public async Task<Result> Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
    {
        var currentUserId = userContext.UserId;
        var account = await dbContext.Accounts
            .Include(x => x.AccountType)
            .Include(x => x.Currency)
            .FirstOrDefaultAsync(x => x.Id == request.AccountId, cancellationToken);
        var canDelete = account.CanDelete(currentUserId);

        if (!canDelete)
            return Errors.Forbidden;

        dbContext.Accounts.Remove(account);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();

    }
}