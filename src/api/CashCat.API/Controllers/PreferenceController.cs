using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WalletUp.Application.Preference.Commands.CreatePreference;
using WalletUp.Application.Preference.Commands.UpdatePreference;
using CashCat.API.Extensions;

namespace CashCat.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PreferenceController(IMediator mediator):ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreatePreference(CreatePreferenceCommand command)
    {
        var result=await mediator.Send(command);
        return this.ToActionResult(result);
    }

    [HttpPatch]
    public async Task<IActionResult> UpdatePreference(UpdatePreferenceCommand command)
    {
        var result=await mediator.Send(command);
        return this.ToActionResult(result);
    }
}
