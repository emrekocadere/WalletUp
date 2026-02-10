using CashCat.Integrations.Models;
using CashCat.Integrations.Services;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Insight.Dtos;
using InsightRecommendation = WalletUp.Application.Insight.Dtos.InsightRecommendation;

namespace CashCat.Infstructre.Services;

public class InsightService(GeminiService geminiService) : IInsightService
{
    public async Task<InsightDto> GetInsight(object data,string  abcs)
    {
        var baseInsight= await geminiService.GetInsight(data,abcs);
        var insightDto = new InsightDto
        {
            Summary = baseInsight.summary,
            Recommendations = baseInsight.recommendations.Select(x=>new  InsightRecommendation
            {
                Title = x.title,
                Description = x.description
            }).ToList()

        };
        return insightDto;
    }
}



