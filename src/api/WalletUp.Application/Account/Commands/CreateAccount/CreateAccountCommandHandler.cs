using AutoMapper;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using MediatR;
using Microsoft.Extensions.Logging;
using WalletUp.Application.Common.Services;

namespace WalletUp.Application.Account.Commands.CreateAccount;

public class CreateAccountCommandHandler(
    IApplicationDbContext dbContext,
    IMapper mapper,
    IUserContext userContext,
    ILogger<CreateAccountCommandHandler> logger
    ) : IRequestHandler<CreateAccountCommand, Result>
{
    public async Task<Result> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
    {
        var currentUserId = userContext.UserId;
        logger.LogInformation("Creating account for user {UserId} with initial balance: {InitialBalance}", currentUserId, request.InitialBalance);
        var account = mapper.Map<WalletUp.Domain.Entities.Account>(request);
        account.UserId = userContext.UserId;

        dbContext.Accounts.Add(account);

        try
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while creating account for user {UserId}", currentUserId);
            return Errors.UnexpectedError;
        }

        return Result.Success();

    }
}
