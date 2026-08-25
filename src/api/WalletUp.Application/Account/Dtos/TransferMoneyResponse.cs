namespace WalletUp.Application.Account.Dtos;

public class TransferMoneyResponse
{
    public Guid FromAccountId { get; set; }
    public Guid ToAccountId { get; set; }
    public double AmountDebited { get; set; }
    public double AmountCredited { get; set; }
    public double Rate { get; set; }
}
