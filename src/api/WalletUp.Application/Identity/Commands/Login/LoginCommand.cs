using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Identity.Dtos;

namespace WalletUp.Application.Identity.Commands.Login;

public record LoginCommand: IRequest<ResultT<TokenDto>>
{
        public required string Email { get; init; }
        public required string Password { get; init; }
}