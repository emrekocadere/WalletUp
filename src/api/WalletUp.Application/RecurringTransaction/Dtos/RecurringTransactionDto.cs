using WalletUp.Application.Account.Dtos;
using WalletUp.Application.Transaction.Dtos;

namespace WalletUp.Application.RecurringTransaction.Dtos;

public class RecurringTransactionDto
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public double Amount { get; set; }
    public required string Frequency { get; set; }
    public required AccountDto Account { get; set; }
    public required CategoryDto Category { get; set; }
    public required TransactionTypeDto TransactionType { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime NextOccurrence { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
