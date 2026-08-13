namespace WalletUp.Domain.Entities;

public class RecurringTransaction
{
    public Guid Id { get; set; }
    public Guid AccountId { get; set; }
    public Guid CategoryId { get; set; }
    public Guid TransactionTypeId { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public double Amount { get; set; }
    public RecurrenceFrequency Frequency { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime NextOccurrence { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Account? Account { get; set; }
    public Category? Category { get; set; }
    public TransactionType? TransactionType { get; set; }

    public DateTime AdvanceOccurrence(DateTime from) => Frequency switch
    {
        RecurrenceFrequency.Weekly => from.AddDays(7),
        RecurrenceFrequency.BiWeekly => from.AddDays(14),
        RecurrenceFrequency.Monthly => from.AddMonths(1),
        RecurrenceFrequency.Quarterly => from.AddMonths(3),
        RecurrenceFrequency.SemiAnnually => from.AddMonths(6),
        RecurrenceFrequency.Annually => from.AddYears(1),
        _ => throw new ArgumentOutOfRangeException(nameof(Frequency), Frequency, "Unsupported recurrence frequency.")
    };
}
