using MediatR;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Identity.Commands.VerifyOtp;

public class VerifyOtpCommandHandler(IIdentityService identityService)
    : IRequestHandler<VerifyOtpCommand, Result>
{
    public async Task<Result> Handle(VerifyOtpCommand request, CancellationToken cancellationToken)
    {
        return await identityService.VerifyOtp(request.Email, request.OtpCode);
    }
}
