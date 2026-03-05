using System.Security.Claims;
using AutoMapper;
using Google.Apis.Auth;
using WalletUp.Application.Auth.Commands.Register;
using WalletUp.Application.Identity;
using WalletUp.Application.Identity.Commands.GoogleLogin;
using WalletUp.Application.Identity.Commands.Login;
using WalletUp.Application.Identity.Dtos;
using WalletUp.Domain.Common;
using WalletUp.Domain.Services;
using WalletUp.Infstructre.Identity.Models;
using CashCat.Infstructre.Persistence.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.Extensions.Logging;
using WalletUp.Application.Common.Services;

namespace CashCat.Infstructre.Identity;

public class IdentityService(
    IMapper mapper,
    RoleManager<ApplicationRole> roleManager,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    ITokenService tokenService,
    IUserTokenRepository userTokenRepository,
    ILogger<IdentityService> logger,
    IUserContext userContext)
    : IIdentityService
{
    public async Task<ResultT<TokenDto>> Register(RegisterCommand command)
    {
        // var existingUser = await userManager.FindByNameAsync(command.Email);
        // if (existingUser != null)
        // {
        //     
        //
        //     
        //     
        // }
        // else
        // {

        if ((await roleManager.RoleExistsAsync("user")) == false)
        {
            var roleResult = await roleManager
                .CreateAsync(new ApplicationRole(){Name = "user"});
        
            if (roleResult.Succeeded == false)
            {
                var roleErros = roleResult.Errors.Select(e => e.Description);
            }
        }

        var user= mapper.Map<ApplicationUser>(command);
        
        user.UserName = user.Name + user.Surname;

        var identityResult = await userManager.CreateAsync(user, command.Password);
        
        var addUserToRoleResult = await userManager.AddToRoleAsync(user: user, role: "user");
        
        List<Claim> authClaims = [
            new (ClaimTypes.Name, user.UserName),
            new(ClaimTypes.NameIdentifier,user.Id.ToString()),
            new (ClaimTypes.Role, "user"),
            new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
    
        ];
        var refreshToken = tokenService.GenerateRefreshToken();
        var accessToken=tokenService.GenerateAccessToken(authClaims);

        var userToken = new ApplicationUserToken
        {
            UserId = user.Id,
            LoginProvider = "Journify",
            Name = "RefreshToken",
            Value = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };
        
        await userTokenRepository.Create(userToken);

        await userTokenRepository.SaveChanges();
        var tokenDto = new TokenDto()
        {
           RefreshToken = refreshToken,
           AccessToken = accessToken,
           IsOnboardingCompleted = false
        };
        return tokenDto;

    }

    public async Task<ResultT<TokenDto>> Login(LoginCommand command)
    {
        var user = await  userManager.FindByEmailAsync(command.Email);
        
       var result= await signInManager.PasswordSignInAsync(user, command.Password, false, false);
       
       if (result.Succeeded == false)
       {
           return Errors.AccountNotFound;
       }
       
        List<Claim> authClaims = [
            new (ClaimTypes.Name, user.UserName),
            new(ClaimTypes.NameIdentifier,user.Id.ToString())
            // new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // bu nedir
        
        ];
        
        var userRoles = await userManager.GetRolesAsync(user);
        
        foreach (var userRole in userRoles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, userRole));
        }
        
        var accessToken = tokenService.GenerateAccessToken(authClaims);
        
        string refreshToken = tokenService.GenerateRefreshToken();

        var tokenInfo= userTokenRepository.GetByUserId(user.Id);

  
        tokenInfo.ExpiresAt = DateTime.UtcNow.AddDays(7);
        tokenInfo.Value = refreshToken;
        
        
        await userTokenRepository.SaveChanges();
        
        var tokenDto = new TokenDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            IsOnboardingCompleted = user.IsOnboardingCompleted
        };

        return tokenDto;
    }
    
    public async  Task<ResultT<TokenDto>> Refresh(TokenDto tokenModel)
    {
        var tokenInfo = userTokenRepository.GetByToken(tokenModel.RefreshToken);
        
        if (tokenInfo == null || tokenInfo.ExpiresAt <= DateTime.UtcNow)
        {
            return Errors.AccountNotFound;
        }
        
        var user = await userManager.FindByIdAsync(tokenInfo.UserId.ToString());
        
        if (user == null)
        {
            return Errors.AccountNotFound;
        }
        
        var userRoles = await userManager.GetRolesAsync(user);
        List<Claim> authClaims = new()
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };
        
        foreach (var role in userRoles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, role));
        }
        
        var newAccessToken = tokenService.GenerateAccessToken(authClaims);
        var newRefreshToken = tokenService.GenerateRefreshToken();
        
        tokenInfo.Value = newRefreshToken;
        tokenInfo.ExpiresAt = DateTime.UtcNow.AddDays(7);
        await userTokenRepository.SaveChanges();
        
        var tokenDto = new TokenDto
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            IsOnboardingCompleted = user.IsOnboardingCompleted
        };
        
        return tokenDto;
    }

    public async Task<Result> DeleteUser(Guid userId)
    {
         var user= await userManager.FindByIdAsync(userId.ToString());
        var result = await userManager.DeleteAsync(user);
        if(result.Succeeded)
            return Result.Success();
        else
        {
            return Result.Failure(Errors.AccountNotFound);
        }
        
    }

    public Task<Result> Logout()
    {
        userTokenRepository.DeleteByUserId(userContext.UserId);
        // Refresh token'ı veritabanından sil
        // var userId = userContext.UserId;
        // var userToken = userTokenRepository.GetByUserId(userId);
        // if (userToken != null)
        // {
        //     userTokenRepository.Delete(userToken);
        //     await userTokenRepository.SaveChanges();
        // }
        
        return Task.FromResult(Result.Success());
    }

    public async Task<Result> CompleteOnboarding(Guid userId)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            return Result.Failure(Errors.AccountNotFound);
        user.IsOnboardingCompleted = true;
        await userManager.UpdateAsync(user);
        return Result.Success();
    }

    public async Task<ResultT<TokenDto>> GoogleLogin(GoogleLoginCommand command)
    {
        try
        {
            
            var payload = await GoogleJsonWebSignature.ValidateAsync(command.IdToken);
            var user = await userManager.FindByEmailAsync(payload.Email);
            
            if (user == null)
            {
                if (!await roleManager.RoleExistsAsync("user"))
                {
                    await roleManager.CreateAsync(new ApplicationRole { Name = "user" });
                }

                user = new ApplicationUser
                {
                    Email = payload.Email,
                    UserName = payload.Email,
                    Name = payload.GivenName ?? payload.Name ?? "User",
                    Surname = payload.FamilyName ?? "",
                    EmailConfirmed = true
                };

                var createResult = await userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                { ;
                    return Errors.AccountNotFound;
                }

                await userManager.AddToRoleAsync(user, "user");
            }

            
            var userRoles = await userManager.GetRolesAsync(user);
            List<Claim> authClaims = new()
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            
            var accessToken = tokenService.GenerateAccessToken(authClaims);
            var refreshToken = tokenService.GenerateRefreshToken();
            
            var existingToken = userTokenRepository.GetByUserId(user.Id);
            if (existingToken != null)
            {
                existingToken.Value = refreshToken;
                existingToken.ExpiresAt = DateTime.UtcNow.AddDays(7);
            }
            else
            {
                var userToken = new ApplicationUserToken
                {
                    UserId = user.Id,
                    LoginProvider = "Google",
                    Name = "RefreshToken",
                    Value = refreshToken,
                    ExpiresAt = DateTime.UtcNow.AddDays(7)
                };
                await userTokenRepository.Create(userToken);
            }

            await userTokenRepository.SaveChanges();
            return new TokenDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                IsOnboardingCompleted = user.IsOnboardingCompleted
            };
        }
        catch (InvalidJwtException ex)
        {
            return Errors.AccountNotFound;
        }
        catch (Exception ex)
        {
            return Errors.AccountNotFound;
        }
    }
}