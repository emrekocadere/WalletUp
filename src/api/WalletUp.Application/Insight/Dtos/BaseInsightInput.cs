namespace WalletUp.Application.Insight.Dtos;

public class InsightRequest
{
   public virtual string? CurrencyUsed { get; set; }
   public virtual string? LivingIn { get; set; }
   public string? Occupation { get; set; }
   public double? MonthlyIncome { get; set; }
   public required InsightRequestData Data { get; set; }
}