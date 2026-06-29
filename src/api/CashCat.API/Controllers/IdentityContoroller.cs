using WalletUp.Application.Auth.Commands.Register;
using WalletUp.Application.Identity.Commands.GoogleLogin;
using WalletUp.Application.Identity.Commands.Login;
using WalletUp.Application.Identity.Dtos;
using WalletUp.Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WalletUp.Application.Identity.Commands.DeleteUser;
using WalletUp.Application.Identity.Commands.RefreshToken;
using WalletUp.Application.Identity.Commands.Logout;

namespace CashCat.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IdentityController(IMediator mediator) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<ResultT<TokenDto>>> Register(RegisterCommand command)
    {
        var result = await mediator.Send(command);
        
        if (result.IsSuccess)
        {
            Response.Cookies.Append("refreshToken", result.Value.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(7),
                Path = "/"
            });
        }
        
        return result;
    }
    
    [HttpPost("refresh")]
    public async Task<ActionResult<ResultT<TokenDto>>> Refresh()
    {
        // Cookie'den refresh token al
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized(Result.Failure(Errors.AccountNotFound));
        }

        // Access token'ı header'dan al (varsa)
        var accessToken = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        
        // Eğer access token yoksa boş string gönder (refresh token ile yenileme yapılabilir)
        if (string.IsNullOrEmpty(accessToken))
        {
            accessToken = string.Empty;
        }
        
        var command = new RefreshTokenCommand(accessToken, refreshToken);
        var result = await mediator.Send(command);
        
        if (result.IsSuccess)
        {
            Response.Cookies.Append("refreshToken", result.Value.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(7),
                Path = "/"
            });
        }
        
        return result;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ResultT<TokenDto>>> Login(LoginCommand command)
    {

        var result = await mediator.Send(command);
        
        if (result.IsSuccess)
        {
            Response.Cookies.Append("refreshToken", result.Value.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(7),
                Path = "/"
            });
        }

        return result;
    }

    [HttpPost("google")]
    public async Task<ActionResult<ResultT<TokenDto>>> GoogleLogin(GoogleLoginCommand command)
    {
        var result = await mediator.Send(command);
        
        if (result.IsSuccess)
        {
            Response.Cookies.Append("refreshToken", result.Value.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(7),
                Path = "/"
            });
        }

        return result;
    }
    
    [HttpDelete]
    public async Task<ActionResult> DeleteUser()
    {
        var result = await mediator.Send(new DeleteUserCommand());
        return Ok(result);
    }
    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        var result = await mediator.Send(new LogoutCommand());
        return Ok(result);
    }
}