using MediatR;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Identity.Commands.ResetPassword;

public record ResetPasswordCommand : IRequest<Result>
{
    public required string Email { get; init; }
    public required string OtpCode { get; init; }
    public required string NewPassword { get; init; }
}
