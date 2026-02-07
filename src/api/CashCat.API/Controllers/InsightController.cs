using MediatR;
using Microsoft.AspNetCore.Mvc;
using WalletUp.Application.Insight.Queries.GetInsight;

namespace CashCat.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InsightController(IMediator mediator): ControllerBase
{
     [HttpGet]
     public async Task<ActionResult> GetInsight(string taskName)
     {
          var query = new GetInsightQuery(taskName);
          var result = await mediator.Send(query);
          
          if (!result.IsSuccess)
               return BadRequest(result.Error?.Description);
               
          return Ok(result.Value);
     }
}