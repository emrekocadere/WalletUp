using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Identity.Dtos;

namespace WalletUp.Application.Auth.Commands.Register;

public record RegisterCommand:IRequest<ResultT<TokenDto>>
{
    public required string
        Email { get; init; } // benim buraya required yazmam ile [required] yazmama arasıda ne farkj var

    public required string Password { get; init; }
    public required string Name { get; init; }
    public required string Surname { get; init; }
}