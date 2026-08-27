namespace WalletUp.Application.Abstractions;

public interface IEmailService
{
    Task SendPasswordResetOtpEmail(string toEmail, string name, string otpCode);
}
