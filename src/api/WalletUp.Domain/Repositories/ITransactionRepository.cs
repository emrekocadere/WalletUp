using WalletUp.Domain.Entities;

namespace WalletUp.Domain.Repositories;

public interface ITransactionRepository:IRepository<Transaction>
{
     ICollection<Transaction> GetTransactions(
          Guid userId,
          Guid? categoryId = null,
          Guid? transactionTypeId = null,
          Guid? accountId = null,
          DateTime? startDate = null,
          DateTime? endDate = null);
     int  GetTransactionQuantityByMonths(Guid userId,int year,int month);
     double  GetIncomesByMonths(Guid userId,int year,int month);
     double  GetExpenseAmountByMonths(Guid userId,int year,int month);
     ICollection<Transaction> GetExpensesByMonths(Guid userId,int year,int month);
     double  GetTotalBalanceByUser(Guid userId);
     ICollection<Transaction> GetTransactionsForReport(Guid userId, DateTime startDate, DateTime endDate);
}