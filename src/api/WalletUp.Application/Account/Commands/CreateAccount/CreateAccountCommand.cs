using WalletUp.Domain.Common;
using MediatR;

namespace WalletUp.Application.Account.Commands.CreateAccount;

public record CreateAccountCommand:IRequest<Result>
{
    public required string Name { get; init; }
    public Guid AccountTypeId { get; init; }
    public double InitialBalance { get; init; }
    public Guid  CurrencyId { get; init; }
}
