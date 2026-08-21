using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Common.Services;
using WalletUp.Application.Goal.Dtos;

namespace WalletUp.Application.Goal.Queries.GetGoals;

public class GetGoalsQueryHandler(
    IMapper mapper,
    IApplicationDbContext dbContext,
    IUserContext userContext)
    :IRequestHandler<GetGoalsQuery, ResultT<ICollection<GoalDto>>>
{
    public async Task<ResultT<ICollection<GoalDto>>> Handle(GetGoalsQuery request, CancellationToken cancellationToken)
    {
        var goals = await dbContext.Goals
            .AsNoTracking()
            .Where(g => g.UserId == userContext.UserId)
            .Include(x => x.Currency)
            .ToListAsync(cancellationToken);
        var goalDtos = mapper.Map<List<GoalDto>>(goals);

        foreach (var goalDto in goalDtos)
        {
            goalDto.CurrentAmount = await dbContext.GoalTransactions
                .AsNoTracking()
                .Where(x => x.GoaldId == goalDto.Id)
                .Include(x => x.TransactionType)
                .SumAsync(x => x.TransactionType!.Name == "income" ? x.Amount : -x.Amount, cancellationToken);
        }

        return goalDtos;
    }
}