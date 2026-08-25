using WalletUp.Application.Goal.Commands.AddTransactionToGoal;
using WalletUp.Application.Goal.Commands.CreateGoal;
using WalletUp.Application.Goal.Commands.DeleteGoal;
using WalletUp.Application.Goal.Dtos;
using WalletUp.Application.Goal.Queries.GetGoals;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WalletUp.Application.Goal.Commands.UpdateGoal;
using CashCat.API.Extensions;

namespace CashCat.API.Controllers;

[ApiController]
[Authorize]
public class GoalController(IMediator mediator):ControllerBase
{
    [HttpPost("api/Goal")]
    public async  Task<ActionResult> CreateGoal(CreateGoalCommand command)
    {
        var result =await  mediator.Send(command);
        return this.ToActionResult(result);
    }

    [HttpGet("api/Goal")]
    public async  Task<ActionResult> GetGoals()
    {
        var result =await  mediator.Send(new GetGoalsQuery());
        return this.ToActionResult(result);
    }

    [HttpPost("api/Goal/{goalId}/Transaction")]
    public async  Task<ActionResult> AddTransactionToGoal(Guid goalId,AddGoalTransactionRequest request)
    {
        var command = new AddTransactionToGoalCommand(
            goalId,
            request.Amount,
            request.TransactionTypeId);

        var result =await  mediator.Send(command);
        return this.ToActionResult(result);
    }

    [HttpDelete("api/Goal/{goalId}")]
    public async  Task<ActionResult> AddTransactionToGoal(Guid goalId)
    {
        var command = new DeleteGoalCommand(goalId);
        var result =await  mediator.Send(command);
        return this.ToActionResult(result);
    }

    [HttpPatch("api/Goal/{id}")]
    public async  Task<ActionResult> UpdateGoal(Guid id,UpdateGoalRequest request)
    {
        var command=new UpdateGoalCommand(
            id,
            request.Name,
            request.Description,
            request.Target);

        var result =await  mediator.Send(command);
        return this.ToActionResult(result);
    }

}