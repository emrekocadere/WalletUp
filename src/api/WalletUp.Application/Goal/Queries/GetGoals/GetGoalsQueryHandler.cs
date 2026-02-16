using AutoMapper;
using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;
using MediatR;
using WalletUp.Application.Common.Services;
using WalletUp.Application.Goal.Dtos;

namespace WalletUp.Application.Goal.Queries.GetGoals;

public class GetGoalsQueryHandler(
    IMapper mapper,
    IGoalRepository goalRepository,
    IUserContext userContext,
    IGoalTransactionRepository goalTransactionRepository)
    :IRequestHandler<GetGoalsQuery, ResultT<ICollection<GoalDto>>>
{
    public Task<ResultT<ICollection<GoalDto>>> Handle(GetGoalsQuery request, CancellationToken cancellationToken)
    {
        var goals = goalRepository.GetAllGoalsByUserId(userContext.UserId);
        var goalDtos = mapper.Map<List<GoalDto>>(goals);
        return Task.FromResult<ResultT<ICollection<GoalDto>>>(goalDtos);
    }
}