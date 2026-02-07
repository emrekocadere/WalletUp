namespace WalletUp.Application.Insight.Dtos;

public class InsightDto
{
    public required string Summary { get; set; }
    public List<InsightRecommendation>? Recommendations { get; set; }
}

public class InsightRecommendation
{
    public required string Title { get; set; }
    public required  string Description { get; set; }
}