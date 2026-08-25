namespace WalletUp.Domain.Entities;

public class Transaction
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }=DateTime.UtcNow;
    public Guid AccountId { get; set; }
    public Guid CategoryId { get; set; }
    public Guid TransactionTypeId { get; set; }
    public double Amount { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }

    public TransactionType? TransactionType { get; set; }
    public Account? Account { get; set; }
    public Category? Category { get; set; }

    public bool CanDelete(Guid userId) => Account?.UserId == userId;
}