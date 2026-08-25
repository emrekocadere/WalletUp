using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WalletUp.Application.Insight.Queries.GetInsight;
using CashCat.API.Extensions;

namespace CashCat.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InsightController(IMediator mediator): ControllerBase
{
     [HttpGet]
     public async Task<ActionResult> GetInsight(string taskName)
     {
          var query = new GetInsightQuery(taskName);
          var result = await mediator.Send(query);

          if (!result.IsSuccess)
               return this.ToErrorResult(result);

          return Ok(result.Value);
     }
}