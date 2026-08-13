namespace WalletUp.Application.Report.Dtos;

public class AnnualReportDto
{
    public int Year { get; set; }
    public required string PreferredCurrency { get; set; }
    public List<MonthlyReportDto> Months { get; set; } = new();
}
