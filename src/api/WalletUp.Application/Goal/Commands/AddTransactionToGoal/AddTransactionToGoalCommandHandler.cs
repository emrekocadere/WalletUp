using AutoMapper;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using WalletUp.Domain.Entities;
using MediatR;

namespace WalletUp.Application.Goal.Commands.AddTransactionToGoal;

public class AddTransactionToGoalCommandHandler(
    IMapper mapper,
    IApplicationDbContext dbContext)
    : IRequestHandler<AddTransactionToGoalCommand, Result>
{
    public async Task<Result> Handle(AddTransactionToGoalCommand request, CancellationToken cancellationToken)
    {
        var transaction = mapper.Map<GoalTransaction>(request);
        var goal = await dbContext.Goals.FindAsync(new object[] { request.GoaldId }, cancellationToken);
        dbContext.GoalTransactions.Add(transaction);
        var affecredRows = await dbContext.SaveChangesAsync(cancellationToken);
        if (affecredRows > 0)
            return Result.Success();
        else
        {
            return Result.Failure(Errors.AccountNotFound);
        }
    }
}