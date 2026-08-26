namespace WalletUp.Domain.Entities;

public class Feedback
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Message { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
