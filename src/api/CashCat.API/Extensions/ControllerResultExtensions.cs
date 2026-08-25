using Microsoft.AspNetCore.Mvc;
using WalletUp.Domain.Common;

namespace CashCat.API.Extensions;

public static class ControllerResultExtensions
{
    public static ActionResult ToActionResult(this ControllerBase controller, Result result)
    {
        return result.IsSuccess ? controller.Ok(result) : controller.ToErrorResult(result);
    }

    public static ActionResult ToErrorResult(this ControllerBase controller, Result result)
    {
        return result.Error?.Id switch
        {
            nameof(Errors.UnexpectedError) => controller.StatusCode(StatusCodes.Status500InternalServerError, result),
            nameof(Errors.Forbidden) => controller.StatusCode(StatusCodes.Status403Forbidden, result),
            "NotFound" => controller.NotFound(result),
            _ => controller.BadRequest(result)
        };
    }
}
