using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WalletUp.Application.Report.Queries.GetAnnualReport;
using WalletUp.Domain.Common;

namespace CashCat.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportController(IMediator mediator) : ControllerBase
{
    [HttpGet("annual/{year:int?}")]
    public async Task<ActionResult<Result>> GetAnnualReport(int? year = null)
    {
        var result = await mediator.Send(new GetAnnualReportQuery(year ?? DateTime.UtcNow.Year));
        if (result.IsSuccess)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }
}
