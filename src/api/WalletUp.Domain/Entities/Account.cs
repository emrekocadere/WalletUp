namespace WalletUp.Domain.Entities;

public class Account
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public Guid UserId { get; set; }
    public Guid AccountTypeId { get; set; }
    public double Balance { get; set; }
    public Guid CurrencyId { get; set; }
    public DateTime CreatedAt { get; set; }= DateTime.UtcNow;

    public ICollection<Transaction>? Transactions { get; set; }
    public AccountType? AccountType { get; set; }
    public Currency? Currency { get; set; }
    
    public ICollection<Goal>? Goals { get; set; }

    public bool CanDelete(Guid userId) => UserId == userId;
    public bool CanUpdate(Guid userId) => UserId == userId;
}