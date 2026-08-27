using MediatR;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Identity.Commands.ResetPassword;

public class ResetPasswordCommandHandler(IIdentityService identityService)
    : IRequestHandler<ResetPasswordCommand, Result>
{
    public async Task<Result> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        return await identityService.ResetPassword(request.Email, request.OtpCode, request.NewPassword);
    }
}
