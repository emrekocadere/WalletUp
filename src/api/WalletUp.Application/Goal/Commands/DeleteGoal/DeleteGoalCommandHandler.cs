using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using MediatR;

namespace WalletUp.Application.Goal.Commands.DeleteGoal;

public class DeleteGoalCommandHandler(
     IApplicationDbContext dbContext)
    :IRequestHandler<DeleteGoalCommand,Result>
{
    public async Task<Result> Handle(DeleteGoalCommand request, CancellationToken cancellationToken)
    {
        var goal = await dbContext.Goals.FindAsync(new object[] { request.GoalId }, cancellationToken);
        if (goal != null)
        {
            dbContext.Goals.Remove(goal);
        }

        var affectedRows = await dbContext.SaveChangesAsync(cancellationToken);
        if(affectedRows>0)
            return Result.Success();
        else
            return Result.Failure(Errors.AccountNotFound);

    }
}