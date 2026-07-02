using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;
using MediatR;
using WalletUp.Application.Common.Services;


namespace WalletUp.Application.Account.Commands.UpdateAccount;

public class UpdateAccountCommandHandler(
  IAccountRepository accountRepository,
    IUserContext userContext)
    :IRequestHandler<UpdateAccountCommand, Result>
{
    public async Task<Result> Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
    {
        var userId = userContext.UserId;
        
        var account = await accountRepository.GetByIdAsync(request.Id);
        var canUpdate = account.CanUpdate(userId);
        
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

        await accountRepository.SaveChanges();
       
        return Result.Success();
       
    }
}