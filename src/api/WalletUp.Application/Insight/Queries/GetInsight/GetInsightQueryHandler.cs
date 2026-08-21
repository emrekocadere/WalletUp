using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Account.Dtos;
using WalletUp.Application.Common.Services;
using WalletUp.Application.Goal.Dtos;
using WalletUp.Application.Insight.Dtos;
using WalletUp.Application.Transaction.Dtos;
using WalletUp.Domain.Common;



namespace WalletUp.Application.Insight.Queries.GetInsight;

public class GetInsightQueryHandler(
    IInsightService insightService,
    ICacheService cacheService,
    IApplicationDbContext dbContext,
    IUserContext userContext,
    IMapper mapper)
    : IRequestHandler<GetInsightQuery, ResultT<InsightDto>>
{
    public async Task<ResultT<InsightDto>> Handle(GetInsightQuery request, CancellationToken cancellationToken)
    {
        var userId = userContext.UserId;
        var cacheKey = $"insights:{userId}:{request.TaskName}";
        var cachedInsight = await cacheService.GetAsync<InsightDto>(cacheKey);
        if (cachedInsight is not null)
        {
            return cachedInsight;
        }


        var preference = await dbContext.Preferences
            .AsNoTracking()
            .Include(x => x.Currency)
            .Include(x => x.Country)
            .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);
        var accounts = await dbContext.Accounts
            .Where(x => x.UserId == userId)
            .Include(x => x.AccountType)
            .Include(x => x.Currency)
            .ToListAsync(cancellationToken);
        var transactions = await dbContext.Transactions
            .AsNoTracking()
            .Include(x => x.Account)
            .Where(x => x.Account!.UserId == userId)
            .Include(x => x.TransactionType)
            .Include(x => x.Category)
            .ToListAsync(cancellationToken);
        var goals = await dbContext.Goals
            .AsNoTracking()
            .Where(g => g.UserId == userId)
            .Include(x => x.Currency)
            .ToListAsync(cancellationToken);

        var accountsDtos= mapper.Map<List<AccountDto>>(accounts);
        var transactionDtos= mapper.Map<List<TransactionDto>>(transactions);
        var goalDtos= mapper.Map<List<GoalDto>>(goals);

        if (preference == null)
        {
            var defaultInsight = new InsightDto
            {
                Summary = "Lütfen hesap tercihlerinizi tamamlayın. Para birimi, ülke, meslek ve aylık gelir bilgileriniz giriniz.",
                Recommendations = new List<InsightRecommendation>
                {
                    new()
                    {
                        Title = "Profil Tamamlama",
                        Description = "Tercihlerinizi güncellemek için Ayarlar > Tercihler sayfasını ziyaret edin."
                    }
                }
            };
            
            await cacheService.SetAsync(cacheKey, defaultInsight, TimeSpan.FromHours(24));
            return defaultInsight;
        }
        var baseInsightInput = new InsightRequest()
        {
            CurrencyUsed = preference.Currency.ISO4217Code,
            LivingIn = preference.Country.Name,
            Occupation = preference.Occupation,
            MonthlyIncome = preference.MonthlyIncome,
            Data = new InsightRequestData()
            {
                Accounts = accountsDtos,
                Transactions = transactionDtos,
                Goals = goalDtos
            }

        };
        try
        {
            var result = await insightService.GetInsight(baseInsightInput, request.TaskName);
            await cacheService.SetAsync(cacheKey, result, TimeSpan.FromHours(12));

            return result;
        }
        catch (Exception _)
        {
            return Errors.InsightError;
        }
    }
}