using MediatR;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Identity.Commands.VerifyOtp;

public record VerifyOtpCommand : IRequest<Result>
{
    public required string Email { get; init; }
    public required string OtpCode { get; init; }
}
