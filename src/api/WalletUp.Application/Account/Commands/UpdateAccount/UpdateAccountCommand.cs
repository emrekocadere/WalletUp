using WalletUp.Domain.Common;
using MediatR;

namespace WalletUp.Application.Account.Commands.UpdateAccount;

public record UpdateAccountCommand:IRequest<Result>
{
    public Guid Id { get; init; }
    public string? Name { get; init; }
    public Guid? CurrencyId { get; init; }
    public Guid? AccountTypeId { get; init; }
}
