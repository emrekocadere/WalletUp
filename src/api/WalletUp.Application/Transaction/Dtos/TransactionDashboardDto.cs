namespace WalletUp.Application.Transaction.Dtos;

public class TransactionDashboardDto
{
    public double Income { get; set; }
    public double Expense { get; set; }
    public int  Quantity { get; set; }
    public int GoalQuantity { get; set; }
    public double CurrentTotalBalance { get; set; }
    public required string PreferredCurrency { get; set; }
    public List<CategoryExpenseDto> CategoryExpenses { get; set; } = new();
}