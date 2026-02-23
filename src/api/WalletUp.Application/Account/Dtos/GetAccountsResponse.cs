namespace WalletUp.Application.Account.Dtos;

public class GetAccountsResponse
{
    public ICollection<AccountDto> Accounts { get; set; } = new List<AccountDto>();
    public double TotalBalanceBasedOnPreferredCurrency { get; set; }
    public int AccountCount { get; set; }
    public required string PreferredCurrency { get; set; }
}