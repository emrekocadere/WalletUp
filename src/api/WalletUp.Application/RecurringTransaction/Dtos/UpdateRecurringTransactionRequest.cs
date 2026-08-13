using WalletUp.Domain.Entities;

namespace WalletUp.Application.RecurringTransaction.Dtos;

public class UpdateRecurringTransactionRequest
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public double Amount { get; set; }
    public Guid CategoryId { get; set; }
    public Guid TransactionTypeId { get; set; }
    public RecurrenceFrequency Frequency { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; }
}
