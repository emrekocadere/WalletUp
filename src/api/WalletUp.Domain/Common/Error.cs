namespace WalletUp.Domain.Common;

public record Error(string Id, string Description);

public static class Errors
{
    public static Error AccountNotFound { get; } = new("AccountNotFound", "Account not found.");
    public static Error InsufficientFunds { get; } = new("InsufficientFunds", "Insufficient balance.");
    public static Error UnauthorizedAccess { get; } = new("UnauthorizedAccess", "Unauthorized access.");
    public static Error Forbidden { get; } = new("Forbidden", "Access forbidden.");
    public static Error InsightError { get; } = new("InsightError", "Insight error.");
    public static Error InvalidTransaction { get; } = new("InvalidTransaction", "Invalid transaction.");
    public static Error ServiceUnavailable { get; } = new("ServiceUnavailable", "Service is currently unavailable.");
    public static Error GoogleSignInFailed { get; } = new("GoogleSignInFailed", "Google sign-in failed.");
    public static Error GoogleSignUpFailed { get; } = new("GoogleSignUpFailed", "Google sign-up failed.");
    public static Error AIIntegrationFailed { get; } = new("AIIntegrationFailed", "AI integration failed.");
    public static Error AIResponseError { get; } = new("AIResponseError", "Error in AI response.");
    public static Error UserNotFound { get; } = new("UserNotFound", "User not found.");
    public static Error IncorrectPassword { get; } = new("IncorrectPassword", "Password is incorrect.");
    public static Error UserCreationFailed { get; } = new("UserCreationFailed", "Failed to create user.");
    public static Error RoleCreationFailed { get; } = new("RoleCreationFailed", "Failed to create role.");
    public static Error UserDeletionFailed { get; } = new("UserDeletionFailed", "Failed to delete user.");
    public static Error InvalidReportRequest { get; } = new("InvalidReportRequest", "Invalid report request. Year must be between 2000 and next year.");
    public static Error InvalidRefreshToken { get; } = new("InvalidRefreshToken", "Refresh token is invalid or has expired.");
    public static Error UnexpectedError { get; } = new("UnexpectedError", "An unexpected error occurred.");
    public static Error SameAccountTransfer { get; } = new("SameAccountTransfer", "Cannot transfer money to the same account.");
    public static Error CurrencyConversionFailed { get; } = new("CurrencyConversionFailed", "Could not convert between the account currencies.");
    public static Error CurrencyNotFound { get; } = new("CurrencyNotFound", "Currency not found.");
    public static Error AccountTypeNotFound { get; } = new("AccountTypeNotFound", "Account type not found.");
    public static Error Validation(string description) => new("ValidationError", description);
}
