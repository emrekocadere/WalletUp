using MediatR;
using WalletUp.Application.Identity.Dtos;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Identity.Commands.GoogleLogin;

public record GoogleLoginCommand : IRequest<ResultT<TokenDto>>
{
    public required string IdToken { get; init; }
}
