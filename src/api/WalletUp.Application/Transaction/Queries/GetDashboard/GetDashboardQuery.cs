using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Transaction.Dtos;

namespace WalletUp.Application.Transaction.Queries.GetDashboard;

public record GetDashboardQuery(int Month, int? Year = null):IRequest<ResultT<TransactionDashboardDto>>;