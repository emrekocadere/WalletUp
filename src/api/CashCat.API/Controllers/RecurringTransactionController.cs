using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WalletUp.Application.RecurringTransaction.Commands.CreateRecurringTransaction;
using WalletUp.Application.RecurringTransaction.Commands.DeleteRecurringTransaction;
using WalletUp.Application.RecurringTransaction.Commands.ToggleRecurringTransactionActive;
using WalletUp.Application.RecurringTransaction.Commands.UpdateRecurringTransaction;
using WalletUp.Application.RecurringTransaction.Dtos;
using WalletUp.Application.RecurringTransaction.Queries.GetRecurringTransactions;
using WalletUp.Domain.Common;

namespace CashCat.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RecurringTransactionController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<Result>> GetRecurringTransactions()
    {
        var result = await mediator.Send(new GetRecurringTransactionsQuery());
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPost]
    public async Task<ActionResult<Result>> CreateRecurringTransaction(CreateRecurringTransactionCommand command)
    {
        var result = await mediator.Send(command);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Result>> UpdateRecurringTransaction(Guid id, UpdateRecurringTransactionRequest request)
    {
        var command = new UpdateRecurringTransactionCommand(
            id,
            request.Title,
            request.Description,
            request.Amount,
            request.CategoryId,
            request.TransactionTypeId,
            request.Frequency,
            request.StartDate,
            request.EndDate,
            request.IsActive);

        var result = await mediator.Send(command);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Result>> DeleteRecurringTransaction(Guid id)
    {
        var result = await mediator.Send(new DeleteRecurringTransactionCommand(id));
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPatch("{id}/toggle-active")]
    public async Task<ActionResult<Result>> ToggleActive(Guid id)
    {
        var result = await mediator.Send(new ToggleRecurringTransactionActiveCommand(id));
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}
