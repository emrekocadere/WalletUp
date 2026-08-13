using MediatR;
using WalletUp.Application.RecurringTransaction.Dtos;
using WalletUp.Domain.Common;

namespace WalletUp.Application.RecurringTransaction.Queries.GetRecurringTransactions;

public record GetRecurringTransactionsQuery : IRequest<ResultT<ICollection<RecurringTransactionDto>>>;
