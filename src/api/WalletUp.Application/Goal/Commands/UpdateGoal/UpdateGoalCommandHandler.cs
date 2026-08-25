using MediatR;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Goal.Commands.UpdateGoal;

public class UpdateGoalCommandHandler(
    IApplicationDbContext dbContext)
    :IRequestHandler<UpdateGoalCommand,Result>
{
    public async Task<Result> Handle(UpdateGoalCommand request, CancellationToken cancellationToken)
    {
        var goal = await dbContext.Goals.FindAsync(new object[] { request.Id }, cancellationToken);
        if (goal is null)
            return Errors.GoalNotFound;

        if(request.Description!=null)
        {
            goal.Description=request.Description;
        }

        if (request.Name != null)
        {
            goal.Title=request.Name;
        }

        if (request.Target.HasValue)
        {
            goal.Target=request.Target.Value;
        }
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}