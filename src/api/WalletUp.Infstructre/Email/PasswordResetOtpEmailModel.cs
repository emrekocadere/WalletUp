namespace CashCat.Infstructre.Email;

public class PasswordResetOtpEmailModel
{
    public required string Name { get; init; }
    public required string OtpCode { get; init; }
}
