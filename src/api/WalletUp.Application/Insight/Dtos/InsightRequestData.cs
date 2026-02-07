using WalletUp.Application.Account.Dtos;
using WalletUp.Application.Goal.Dtos;
using WalletUp.Application.Transaction.Dtos;

namespace WalletUp.Application.Insight.Dtos;

public class InsightRequestData
{
    public List<TransactionDto>? Transactions { get; set; }
    public List<AccountDto>? Accounts { get; set; }
    public List<GoalDto>? Goals { get; set; }
}