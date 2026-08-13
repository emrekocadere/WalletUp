using AutoMapper;
using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using WalletUp.Application.Common.Services;

namespace WalletUp.Application.Account.Commands.CreateAccount;

public class CreateAccountCommandHandler(
    IRepository< WalletUp.Domain.Entities.Account> accountRepository,
    IMapper mapper,
    IUserContext userContext,
    ILogger<CreateAccountCommandHandler> logger
    ):IRequestHandler<CreateAccountCommand, Result>
{
    public async Task<Result> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating account with initial balance: {InitialBalance}", request.InitialBalance);
        var account=mapper.Map<WalletUp.Domain.Entities.Account>(request);
        account.UserId = userContext.UserId;
        
      await accountRepository.Create(account);
      var affectedRows=await accountRepository.SaveChanges();
      
      if(affectedRows>0)
          return Result.Success();
      else
      {
            return Result.Failure(Errors.InsufficientFunds);
      }
        
    }
}