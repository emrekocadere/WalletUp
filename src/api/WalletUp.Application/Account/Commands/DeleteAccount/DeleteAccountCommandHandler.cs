using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;
using MediatR;
using WalletUp.Application.Common.Services;

namespace WalletUp.Application.Account.Commands.DeleteAccount;

public class DeleteAccountCommandHandler(
    IAccountRepository accountRepository,
    IUserContext userContext)
    :IRequestHandler<DeleteAccountCommand,Result>
{
    public async Task<Result> Handle(DeleteAccountCommand request, CancellationToken cancellationToken)
    {
        var userId= userContext.UserId;
        var account = accountRepository.GetAccountById(request.AccountId);
        var canDelete=account.CanDelete(userId);
        if (canDelete)
        {
            accountRepository.Delete(request.AccountId);
            return Result.Success();
        }
        
        return Errors.Forbidden;
        
    }
}