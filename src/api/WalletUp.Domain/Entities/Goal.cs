namespace WalletUp.Domain.Entities;

public class Goal
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public double Target { get; set; }
    public Guid CurrencyId { get; set; }
    public double TargetPercent { get; set; }
    public double CurrentAmount { get; set; }

    public DateTime CreationTime { get; set; } = DateTime.UtcNow;

    public ICollection<GoalTransaction>? GoalTransactions { get; set; }
    public Currency? Currency { get; set; }
    
    
    public bool CanDelete(Guid userId) => UserId == userId;
}