using WalletUp.Application.Insight.Dtos;

namespace WalletUp.Application.Abstractions;

public interface IInsightService
{
    Task<InsightDto> GetInsight(object data,string  abcs);
}