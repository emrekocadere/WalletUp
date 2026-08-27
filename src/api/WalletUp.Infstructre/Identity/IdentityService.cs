using System.Security.Claims;
using AutoMapper;
using Google.Apis.Auth;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Auth.Commands.Register;
using WalletUp.Application.Identity;
using WalletUp.Application.Identity.Commands.GoogleLogin;
using WalletUp.Application.Identity.Commands.Login;
using WalletUp.Application.Identity.Dtos;
using WalletUp.Domain.Common;
using WalletUp.Domain.Entities;
using WalletUp.Domain.Services;
using WalletUp.Infstructre.Identity.Models;
using CashCat.Infstructre.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.JsonWebTokens;
using WalletUp.Application.Common.Services;
namespace CashCat.Infstructre.Identity;

public class IdentityService(
    IMapper mapper,
    UserManager<ApplicationUser> userManager,
    ITokenService tokenService,
    CashCatDbContext dbContext,
    IUserContext userContext,
    IEmailService emailService,
    ILogger<IdentityService> logger)
    : IIdentityService
{
    private const int MaxOtpAttempts = 5;
    private static readonly TimeSpan OtpValidityDuration = TimeSpan.FromMinutes(10);

    public async Task<ResultT<TokenDto>> Register(RegisterCommand command)
    {
        var user= mapper.Map<ApplicationUser>(command);

        user.UserName = user.Email;

        var identityResult = await userManager.CreateAsync(user, command.Password);
        if (!identityResult.Succeeded)
        {
            logger.LogError($"Error creating user: {identityResult.Errors.First().Description}");
            return Errors.UserCreationFailed;
        }
        
        var addUserToRoleResult = await userManager.AddToRoleAsync(user: user, role: "user");
        if (!addUserToRoleResult.Succeeded)
        {
            return Errors.RoleCreationFailed;
        }
        
        // Token Section
        
        List<Claim> authClaims = [
            new (ClaimTypes.Name, user.Name),
            new(ClaimTypes.NameIdentifier,user.Id.ToString()),
            new (ClaimTypes.Role, "user"),
            new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
    
        ];
        
        var refreshToken = tokenService.GenerateRefreshToken();
        var accessToken=tokenService.GenerateAccessToken(authClaims);

        var userToken = new ApplicationUserToken
        {
            UserId = user.Id,
            LoginProvider = "WalletUp",
            Name = "RefreshToken",
            Value = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };
        
        dbContext.UserTokens.Add(userToken);
        await dbContext.SaveChangesAsync();

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
        var user = await userManager.FindByEmailAsync(command.Email);

        if (user == null)
        {
            return Errors.NotFound("User");
        }
       
        var result= await userManager.CheckPasswordAsync(user,command.Password);
       
        if (!result)
        {
            return Errors.IncorrectPassword;
        }
       
        // Token Section
        
        List<Claim> authClaims = [
            new (ClaimTypes.Name, user.Name),
            new(ClaimTypes.NameIdentifier,user.Id.ToString())
        ];
        
        var userRoles = await userManager.GetRolesAsync(user);
        
        foreach (var userRole in userRoles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, userRole));
        }
        
        var accessToken = tokenService.GenerateAccessToken(authClaims);
        var refreshToken = tokenService.GenerateRefreshToken();

        var tokenInfo = dbContext.UserTokens.FirstOrDefault(x => x.UserId == user.Id);

        if (tokenInfo != null)
        {
            tokenInfo.ExpiresAt = DateTime.UtcNow.AddDays(7);
            tokenInfo.Value = refreshToken;
        }
        else
        {
            dbContext.UserTokens.Add(new ApplicationUserToken
            {
                UserId = user.Id,
                LoginProvider = "WalletUp",
                Name = "RefreshToken",
                Value = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });
        }

        await dbContext.SaveChangesAsync();
        
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
        var tokenInfo = dbContext.UserTokens.FirstOrDefault(x => x.Value == tokenModel.RefreshToken);

        if (tokenInfo is null || tokenInfo.ExpiresAt < DateTime.UtcNow)
        {
            return Errors.InvalidRefreshToken;
        }

        var user = await userManager.FindByIdAsync(tokenInfo.UserId.ToString());
        if (user is null)
        {
            return Errors.NotFound("User");
        }


        var userRoles = await userManager.GetRolesAsync(user);
        List<Claim> authClaims = new()
        {
            new Claim(ClaimTypes.Name, user.Name),
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
        await dbContext.SaveChangesAsync();
        
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
        var result = await userManager.DeleteAsync(user!);
        if(result.Succeeded)
            return Result.Success();

        return Errors.UserDeletionFailed;


    }

    public Task<Result> Logout()
    {
        dbContext.UserTokens.Where(x => x.UserId == userContext.UserId).ExecuteDelete();
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

        user!.IsOnboardingCompleted = true;
        await userManager.UpdateAsync(user);
        
        return Result.Success();
    }

    public async Task<ResultT<TokenDto>> GoogleLogin(GoogleLoginCommand command)
    {

            var payload = await GoogleJsonWebSignature.ValidateAsync(command.IdToken);
            var user = await userManager.FindByEmailAsync(payload.Email);
            
            if (user == null)
            {
                
                user = new ApplicationUser
                {
                    Email = payload.Email,
                    UserName = payload.Email,
                    Name = payload.GivenName ??  "Unknow",
                    Surname = payload.FamilyName ?? "Unknow",
                    EmailConfirmed = true
                };

                var createResult = await userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                { 
                    return Errors.NotFound("Account");
                }

                await userManager.AddToRoleAsync(user, "user");
            }

            
            var userRoles = await userManager.GetRolesAsync(user);
            List<Claim> authClaims = new()
            {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            
            var accessToken = tokenService.GenerateAccessToken(authClaims);
            var refreshToken = tokenService.GenerateRefreshToken();
            
            var existingToken = dbContext.UserTokens.FirstOrDefault(x => x.UserId == user.Id);
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
                dbContext.UserTokens.Add(userToken);
            }

            await dbContext.SaveChangesAsync();
            return new TokenDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                IsOnboardingCompleted = user.IsOnboardingCompleted
            };

    }

    public async Task<Result> ForgotPassword(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return Errors.UserNotFound;
        }

        var now = DateTime.UtcNow;

        await dbContext.PasswordResetOtps
            .Where(o => o.UserId == user.Id && !o.IsUsed && o.ExpiresAt > now)
            .ExecuteUpdateAsync(setters => setters.SetProperty(o => o.IsUsed, true));

        var otpCode = Random.Shared.Next(0, 1_000_000).ToString("D6");

        dbContext.PasswordResetOtps.Add(new PasswordResetOtp
        {
            UserId = user.Id,
            Code = otpCode,
            ExpiresAt = now.Add(OtpValidityDuration),
            IsUsed = false,
            IsVerified = false,
            AttemptCount = 0,
            CreatedAt = now
        });
        await dbContext.SaveChangesAsync();

        await emailService.SendPasswordResetOtpEmail(user.Email!, user.Name, otpCode);

        return Result.Success();
    }

    public async Task<Result> VerifyOtp(string email, string otpCode)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return Errors.UserNotFound;
        }

        var otp = await dbContext.PasswordResetOtps
            .Where(o => o.UserId == user.Id && !o.IsUsed && o.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();

        if (otp == null)
        {
            return Errors.InvalidOrExpiredOtp;
        }

        if (otp.AttemptCount >= MaxOtpAttempts)
        {
            otp.IsUsed = true;
            await dbContext.SaveChangesAsync();
            return Errors.TooManyOtpAttempts;
        }

        if (otp.Code != otpCode)
        {
            otp.AttemptCount += 1;
            await dbContext.SaveChangesAsync();
            return Errors.InvalidOrExpiredOtp;
        }

        otp.IsVerified = true;
        otp.ExpiresAt = DateTime.UtcNow.Add(OtpValidityDuration);
        await dbContext.SaveChangesAsync();

        return Result.Success();
    }

    public async Task<Result> ResetPassword(string email, string otpCode, string newPassword)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return Errors.UserNotFound;
        }

        var otp = await dbContext.PasswordResetOtps
            .Where(o => o.UserId == user.Id && o.Code == otpCode && o.IsVerified && !o.IsUsed &&
                        o.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();

        if (otp == null)
        {
            return Errors.InvalidOrExpiredOtp;
        }

        var removeResult = await userManager.RemovePasswordAsync(user);
        if (!removeResult.Succeeded)
        {
            logger.LogError("Error removing password for {Email}: {Errors}", email, FormatIdentityErrors(removeResult.Errors));
            return Errors.PasswordResetFailed;
        }

        var addResult = await userManager.AddPasswordAsync(user, newPassword);
        if (!addResult.Succeeded)
        {
            logger.LogError("Error setting new password for {Email}: {Errors}", email, FormatIdentityErrors(addResult.Errors));
            return Errors.PasswordResetFailed;
        }

        otp.IsUsed = true;
        await dbContext.SaveChangesAsync();

        return Result.Success();
    }

    private static string FormatIdentityErrors(IEnumerable<IdentityError> errors) =>
        string.Join(", ", errors.Select(e => e.Description));
}