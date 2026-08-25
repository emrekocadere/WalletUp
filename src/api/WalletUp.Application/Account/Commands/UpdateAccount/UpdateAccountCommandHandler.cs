using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WalletUp.Application.Common.Services;


namespace WalletUp.Application.Account.Commands.UpdateAccount;

public class UpdateAccountCommandHandler(
  IApplicationDbContext dbContext,
    IUserContext userContext)
    :IRequestHandler<UpdateAccountCommand, Result>
{
    public async Task<Result> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
    {
        var currentUserId = userContext.UserId;

        var account = await dbContext.Accounts.FindAsync(request.Id, cancellationToken);

        if (account is null)
        {
            return Errors.NotFound("Account");
        }

        if (!account.CanUpdate(currentUserId))
        {
            return Errors.Forbidden;
        }
        
        if (request.AccountTypeId != null)
        {
            var accountTypeExists = await dbContext.AccountTypes.AnyAsync(x => x.Id == request.AccountTypeId.Value, cancellationToken);
            if (!accountTypeExists)
                return Errors.NotFound("Account type");

            account.AccountTypeId = request.AccountTypeId.Value;
        }

        if (request.CurrencyId != null)
        {
            var currencyExists = await dbContext.Currencies.AnyAsync(x => x.Id == request.CurrencyId.Value, cancellationToken);
            if (!currencyExists)
                return Errors.NotFound("Currency");

            account.CurrencyId = request.CurrencyId.Value;
        }

        if (request.Name != null)
        {
            account.Name = request.Name;
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
       
    }
}