using System.Security.Claims;
using WalletUp.Application.Account.Commands.CreateAccount;
using WalletUp.Application.Account.Commands.DeleteAccount;
using WalletUp.Application.Account.Commands.UpdateAccount;
using WalletUp.Application.Account.Queries.GetAccount;
using WalletUp.Application.Account.Queries.GetAccounts;
using WalletUp.Application.Account.Queries.GetAccountTypes;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WalletUp.Application.Account.Dtos;
using WalletUp.Domain.Common;

namespace CashCat.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController(IMediator mediator):ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> CreateAccount(CreateAccountCommand command)
    {
       var result = await mediator.Send(command);
        if(result.IsSuccess)
            return Ok(result);
        if(result.Error?.Id == nameof(Errors.UnexpectedError))
            return StatusCode(500, result);
        return BadRequest(result);
    }
    
    [HttpGet]
    public async Task<ActionResult> GetAccounts()
    {
        var result = await mediator.Send(new GetAccountsQuery());
        return Ok(result);
    }
    
    [HttpGet("{accountId}")]
    public async Task<ActionResult> GetAccount(Guid accountId)
    {
        var result = await mediator.Send(new GetAccountQuery(accountId));
        return Ok(result);
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAccounts(Guid id)
    {
        var result = await mediator.Send(new DeleteAccountCommand(id));
        if(result.IsSuccess)
            return Ok(result);
        if(result.Error?.Id == nameof(Errors.Forbidden))
            return StatusCode(403, result);
        return BadRequest(result);
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateAccount(Guid id, UpdateAccountRequest request)
    {
        UpdateAccountCommand command = new()
        {
            Id = id,
            Name = request.Name,
            CurrencyId = request.CurrencyId,
            AccountTypeId = request.AccountTypeId
        };
        var result = await mediator.Send(command);
        return Ok(result);
    }
    
    [HttpGet("AccountTypes")]
    [AllowAnonymous]
    public async Task<ActionResult> GetAccountTypes()
    {
        var result = await mediator.Send(new GetAccountTypesQuery());
        return Ok(result);
    }
    
}