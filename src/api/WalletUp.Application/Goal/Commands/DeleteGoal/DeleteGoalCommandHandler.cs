using WalletUp.Application.Abstractions;
using WalletUp.Application.Common.Services;
using WalletUp.Domain.Common;
using MediatR;

namespace WalletUp.Application.Goal.Commands.DeleteGoal;

public class DeleteGoalCommandHandler(
     IApplicationDbContext dbContext,
     IUserContext userContext)
    :IRequestHandler<DeleteGoalCommand,Result>
{
    public async Task<Result> Handle(DeleteGoalCommand request, CancellationToken cancellationToken)
    {
        var goal = await dbContext.Goals.FindAsync(new object[] { request.GoalId }, cancellationToken);
        if (goal is null)
            return Errors.NotFound("Goal");

        if (!goal.CanDelete(userContext.UserId))
            return Errors.Forbidden;

        dbContext.Goals.Remove(goal);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}