namespace WalletUp.Application.Identity.Dtos;

public class TokenDto
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
    public bool IsOnboardingCompleted { get; set; }
}