using WalletUp.Domain.Common;
using MediatR;

namespace WalletUp.Application.Account.Commands.CreateAccount;

public class CreateAccountCommand:IRequest<Result>
{
    public required string Name { get; set; }
    public Guid AccountTypeId { get; set; }
    public double InitialBalance { get; set; }
    public Guid  CurrencyId { get; set; }
    public DateTime CreatedAt { get; set; }
}
