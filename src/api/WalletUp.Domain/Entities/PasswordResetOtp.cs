namespace WalletUp.Domain.Entities;

public class PasswordResetOtp
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Code { get; set; } = "";
    public DateTime ExpiresAt { get; set; }
    public bool IsVerified { get; set; }
    public bool IsUsed { get; set; }
    public int AttemptCount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
