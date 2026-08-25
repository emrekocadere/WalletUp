using AutoMapper;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Common.Services;
using WalletUp.Domain.Common;
using WalletUp.Domain.Entities;
using MediatR;

namespace WalletUp.Application.Goal.Commands.AddTransactionToGoal;

public class AddTransactionToGoalCommandHandler(
    IMapper mapper,
    IApplicationDbContext dbContext,
    IUserContext userContext)
    : IRequestHandler<AddTransactionToGoalCommand, Result>
{
    public async Task<Result> Handle(AddTransactionToGoalCommand request, CancellationToken cancellationToken)
    {
        var goal = await dbContext.Goals.FindAsync(new object[] { request.GoaldId }, cancellationToken);
        if (goal is null)
            return Errors.NotFound("Goal");

        if (!goal.CanUpdate(userContext.UserId))
            return Errors.Forbidden;

        var transaction = mapper.Map<GoalTransaction>(request);
        dbContext.GoalTransactions.Add(transaction);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}