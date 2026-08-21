using AutoMapper;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Common.Services;

namespace WalletUp.Application.Goal.Commands.CreateGoal;

public class CreateGoalCommandHandler(IMapper mapper,
     IApplicationDbContext dbContext,
     IUserContext userContext)
    :IRequestHandler<CreateGoalCommand,Result>
{
    public async Task<Result> Handle(CreateGoalCommand request, CancellationToken cancellationToken)
    {
        var goal=mapper.Map<WalletUp.Domain.Entities.Goal>(request);
        goal.UserId = userContext.UserId;
        dbContext.Goals.Add(goal);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}