using WalletUp.Application.Transaction.Commands.CreateTransaction;
using WalletUp.Application.Transaction.Commands.DeleteTransaction;
using WalletUp.Application.Transaction.Queries.GetCategories;
using WalletUp.Application.Transaction.Queries.GetCurrencies;
using WalletUp.Application.Transaction.Queries.GetDashboard;
using WalletUp.Application.Transaction.Queries.GetTransactions;
using WalletUp.Application.Transaction.Queries.GetTransactionTypes;
using WalletUp.Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WalletUp.Application.Transaction.Commands.UpdateTransaction;
using WalletUp.Application.Transaction.Dtos;
using WalletUp.Application.Transaction.Queries.GetCountries;

namespace CashCat.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<Result>> CreateTransaction(CreateTransactionCommand command)
    {
        var result = await mediator.Send(command);
        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpGet("{accountId}")]
    public async Task<ActionResult<Result>> GetTransactions(
        Guid accountId,
        [FromQuery] Guid? categoryId = null,
        [FromQuery] Guid? transactionTypeId = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var result = await mediator.Send(new GetTransactionsQuery(
            accountId,
            categoryId,
            transactionTypeId,
            startDate,
            endDate
        ));
        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpDelete("{transactionId}")]
    public async Task<ActionResult<Result>> DeleteTransaction(Guid transactionId)
    {
        var result = await mediator.Send(new DeleteTransactionCommand(transactionId));
        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [AllowAnonymous]
    [HttpGet("Currencies")]
    public async Task<ActionResult<Result>> GetCurrencies()
    {
        var result = await mediator.Send(new GetCurrenciesQuery());
        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [AllowAnonymous]
    [HttpGet("categories")]
    public async Task<ActionResult<Result>> GetCategories()
    {
        var result = await mediator.Send(new GetCategoriesQuery());
        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [AllowAnonymous]
    [HttpGet("types")]
    public async Task<ActionResult<Result>> GetTransactionTypes()
    {
        var result = await mediator.Send(new GetTransactionTypesQuery());
        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }
    
    [AllowAnonymous]
    [HttpGet("countries")]
    public async Task<ActionResult<Result>> GetCountries()
    {
        var result = await mediator.Send(new GetCountriesQuery());
        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpGet]
    public async Task<ActionResult<Result>> GetTransaction(
        [FromQuery] Guid? categoryId = null,
        [FromQuery] Guid? transactionTypeId = null,
        [FromQuery] Guid? accountId = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var result = await mediator.Send(new GetTransactionsQuery(
            accountId,
            categoryId,
            transactionTypeId,
            startDate,
            endDate
        ));
        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpGet("dashboard/{month}")]
    public async Task<ActionResult<Result>> GetDashboard(int month, [FromQuery] int? year = null)
    {
        var result = await mediator.Send(new GetDashboardQuery(month, year));
        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Result>> GetDashboard(Guid id, UpdateTransactionRequest request)
    {
        var command = new UpdateTransactionCommand
        (
            id,
            request.TransactionTypeId,
            request.Title,
            request.Description,
            request.Amount,
            request.Date,
            request.CategoryId
        );
        var result = await mediator.Send(command);
        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }
}