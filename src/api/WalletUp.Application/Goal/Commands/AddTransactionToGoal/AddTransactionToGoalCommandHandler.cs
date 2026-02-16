using AutoMapper;
using WalletUp.Domain.Common;
using WalletUp.Domain.Entities;
using WalletUp.Domain.Repositories;
using MediatR;

namespace WalletUp.Application.Goal.Commands.AddTransactionToGoal;

public class AddTransactionToGoalCommandHandler(
    IMapper mapper,
    IRepository<WalletUp.Domain.Entities.GoalTransaction> goalTransactionRepository,
    IGoalRepository goalRepository)
    : IRequestHandler<AddTransactionToGoalCommand, Result>
{
    public async Task<Result> Handle(AddTransactionToGoalCommand request, CancellationToken cancellationToken)
    {
        var transaction = mapper.Map<GoalTransaction>(request);
        var goal = await goalRepository.GetByIdAsync(request.GoaldId);
        await goalTransactionRepository.Create(transaction);
        var affecredRows = await goalTransactionRepository.SaveChanges();
        if (affecredRows > 0)
            return Result.Success();
        else
        {
            return Result.Failure(Errors.AccountNotFound);
        }
    }
}