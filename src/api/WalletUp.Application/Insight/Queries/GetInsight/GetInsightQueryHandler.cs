using AutoMapper;
using MediatR;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Account.Dtos;
using WalletUp.Application.Common.Services;
using WalletUp.Application.Goal.Dtos;
using WalletUp.Application.Insight.Dtos;
using WalletUp.Application.Transaction.Dtos;
using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;



namespace WalletUp.Application.Insight.Queries.GetInsight;

public class GetInsightQueryHandler(
    IInsightService insightService,
    ICacheService cacheService,
    IPrefrenceRepository prefrenceRepository,
    IAccountRepository accountRepository,
    ITransactionRepository transactionRepository,
    IGoalRepository goalRepository,
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

        var preference = prefrenceRepository.GetByUserId(userId);
        var accounts = accountRepository.GetAllAccountsByUserId(userId);
        var transactions = transactionRepository.GetTransactions(userId);
        var goals = goalRepository.GetAllGoalsByUserId(userId);
        
        var accountsDtos= mapper.Map<List<AccountDto>>(accounts);
        var transactionDtos= mapper.Map<List<TransactionDto>>(transactions);
        var goalDtos= mapper.Map<List<GoalDto>>(goals);


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
        catch (Exception ex)
        {
            return Errors.AccountNotFound;
        }
    }
}