using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using RazorLight;
using WalletUp.Application.Abstractions;

namespace CashCat.Infstructre.Email;

public class SmtpEmailService : IEmailService
{
    private readonly IConfiguration configuration;
    private readonly ILogger<SmtpEmailService> logger;
    private readonly RazorLightEngine razorEngine;

    public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
    {
        this.configuration = configuration;
        this.logger = logger;

        var templatesPath = Path.Combine(AppContext.BaseDirectory, "Email", "Templates");
        razorEngine = new RazorLightEngineBuilder()
            .UseFileSystemProject(templatesPath)
            .UseMemoryCachingProvider()
            .Build();
    }

    public async Task SendPasswordResetOtpEmail(string toEmail, string name, string otpCode)
    {
        var host = configuration["Smtp:Host"];
        var port = int.Parse(configuration["Smtp:Port"] ?? "587");
        var username = configuration["Smtp:Username"];
        var password = configuration["Smtp:Password"];
        var fromEmail = configuration["Smtp:From"];
        var fromName = configuration["Smtp:FromName"] ?? "WalletUp";
        var enableSsl = bool.Parse(configuration["Smtp:EnableSsl"] ?? "true");

        var htmlBody = await razorEngine.CompileRenderAsync("PasswordResetOtpEmail.cshtml", new PasswordResetOtpEmailModel
        {
            Name = name,
            OtpCode = otpCode
        });

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(fromName, fromEmail));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = "WalletUp - Password Reset Code";
        message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

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
