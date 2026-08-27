using MediatR;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Identity.Commands.ForgotPassword;

public class ForgotPasswordCommandHandler(IIdentityService identityService)
    : IRequestHandler<ForgotPasswordCommand, Result>
{
    public async Task<Result> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        return await identityService.ForgotPassword(request.Email);
    }
}
