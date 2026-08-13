using WalletUp.Application.Transaction.Dtos;

namespace WalletUp.Application.Account.Dtos;

public class AccountDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required AccountTypeDto AccountType { get; set; }
    // Computed as InitialBalance + net(income - expense) transactions; not AutoMapped, set explicitly by the handler.
    public double Balance { get; set; }
    public CurrencyDto Currency { get; set; }
    public DateTime CreatedAt { get; set; }
    
}