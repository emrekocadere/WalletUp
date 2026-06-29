using System;
using MediatR;
using WalletUp.Application.Common.Services;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Identity.Commands.Logout;

public class LogoutCommandHandler(IIdentityService identityService)
:IRequestHandler<LogoutCommand, Result>
{
    public Task<Result> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        identityService.Logout();
        return Task.FromResult(Result.Success());
    }
}

