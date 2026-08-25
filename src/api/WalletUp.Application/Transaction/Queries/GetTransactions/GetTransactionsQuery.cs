using System.Formats.Tar;
using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Transaction.Dtos;

namespace WalletUp.Application.Transaction.Queries.GetTransactions;

public record GetTransactionsQuery(
    Guid? AccountId=null,
    Guid? CategoryId = null,
    Guid? TransactionTypeId = null,
    DateTime? StartDate = null,
    DateTime? EndDate = null,
    int Page = 1,
    int PageSize = 20
): IRequest<ResultT<PagedResult<TransactionDto>>>;
