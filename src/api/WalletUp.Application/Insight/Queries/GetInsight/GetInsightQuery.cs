using MediatR;
using WalletUp.Application.Insight.Dtos;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Insight.Queries.GetInsight;

public record GetInsightQuery(string TaskName) : IRequest<ResultT<InsightDto>>;
