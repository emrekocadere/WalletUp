namespace WalletUp.Domain.Entities;

public class Preference
{
    public Guid Id { get; set; }
    
    public Guid UserId { get; set; }
    
    public Guid CurrencyId { get; set; }
    public virtual Currency? Currency { get; set; }
    public Guid CountryId { get; set; }
    public virtual Country? Country { get; set; }
    public string? Occupation { get; set; }
    public double? MonthlyIncome { get; set; }
}