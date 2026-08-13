using WalletUp.Application.Transaction.Dtos;

namespace WalletUp.Application.Report.Dtos;

public class MonthlyReportDto
{
    public int Month { get; set; }
    public double Income { get; set; }
    public double Expense { get; set; }
    public int TransactionQuantity { get; set; }
    public List<CategoryExpenseDto> CategoryExpenses { get; set; } = new();
}
