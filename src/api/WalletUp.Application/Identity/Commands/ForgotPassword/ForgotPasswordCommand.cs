using MediatR;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Identity.Commands.ForgotPassword;

public record ForgotPasswordCommand : IRequest<Result>
{
    public required string Email { get; init; }
}
