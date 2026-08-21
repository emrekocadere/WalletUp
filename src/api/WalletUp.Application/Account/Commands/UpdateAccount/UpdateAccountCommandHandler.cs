using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using MediatR;
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

        var account = await dbContext.Accounts.FindAsync(new object[] { request.Id }, cancellationToken);
        var canUpdate = account.CanUpdate(currentUserId);
        
        if (!canUpdate)
        {
            return Errors.Forbidden;
        }
        
        if (request.AccountTypeId != null)
        {
            account.AccountTypeId = request.AccountTypeId.Value;
        }

        if (request.CurrencyId != null)
        {
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