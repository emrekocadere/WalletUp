using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using WalletUp.Application.Abstractions;

namespace CashCat.Infstructre.Email;

public class SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger) : IEmailService
{
    public async Task SendPasswordResetOtpEmail(string toEmail, string name, string otpCode)
    {
        var host = configuration["Smtp:Host"];
        var port = int.Parse(configuration["Smtp:Port"] ?? "587");
        var username = configuration["Smtp:Username"];
        var password = configuration["Smtp:Password"];
        var fromEmail = configuration["Smtp:From"];
        var fromName = configuration["Smtp:FromName"] ?? "WalletUp";
        var enableSsl = bool.Parse(configuration["Smtp:EnableSsl"] ?? "true");

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(fromName, fromEmail));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = "WalletUp - Password Reset Code";
        message.Body = new TextPart("plain")
        {
            Text = $"Hi {name},\n\nYour password reset code is: {otpCode}\n\nThis code will expire in 10 minutes. If you didn't request this, you can safely ignore this email."
        };

        try
        {
            using var client = new SmtpClient();
            await client.ConnectAsync(host, port, enableSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None);
            await client.AuthenticateAsync(username, password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send password reset email to {Email}", toEmail);
            throw;
        }
    }
}
