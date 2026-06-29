namespace WalletUp.Domain.Common;

public record Error(string Id, string Description);

public static class Errors
{
    public static Error AccountNotFound { get; } = new("AccountNotFound", "Account not found.");
    public static Error InsufficientFunds { get; } = new("InsufficientFunds", "Insufficient balance.");
    public static Error UnauthorizedAccess { get; } = new("UnauthorizedAccess", "Unauthorized access.");
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
}
