using WalletUp.Application.Feedback.Commands.CreateFeedback;
using WalletUp.Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CashCat.API.Extensions;

namespace CashCat.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FeedbackController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<Result>> Create(CreateFeedbackCommand command)
    {
        var result = await mediator.Send(command);
        return this.ToActionResult(result);
    }
}
