using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using WalletUp.Domain.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CashCat.Infstructre.Auth.Services;

public class TokenService(IConfiguration configuration) : ITokenService
{
    public string GenerateAccessToken(IEnumerable<Claim> claims)
    {
        var tokenHandler = new JwtSecurityTokenHandler(); // Token üretmk ve doğrulamak için kütphane.


        // JWT oluştururken kullanılan gizli anahtarı (secret key) tanımlar ve SymmetricSecurityKey nesnesine çevirir.
        var authSigningKey = new SymmetricSecurityKey
            (Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));

        //JWT oluşturmak için gerekli tüm bilgileri içeren bir yapıdır.
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = configuration["JWT:ValidIssuer"],
            Audience = configuration["JWT:ValidAudience"],
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddMinutes(5),
            SigningCredentials = new SigningCredentials
                (authSigningKey, SecurityAlgorithms.HmacSha256)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];

        using var randomNumberGenerator = RandomNumberGenerator.Create();
        randomNumberGenerator.GetBytes(randomNumber);


        return Convert.ToBase64String(randomNumber);
    }

    public ClaimsPrincipal GetPrincipalFromExpiredToken(string accessToken)
    {
        // Define the token validation parameters used to validate the token.
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidAudience = configuration["JWT:ValidAudience"],
            ValidIssuer = configuration["JWT:ValidIssuer"],
            ValidateLifetime = false,
            ClockSkew = TimeSpan.Zero,
            IssuerSigningKey = new SymmetricSecurityKey
                (Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        // Validate the token and extract the claims principal and the security token.
        var principal =
            tokenHandler.ValidateToken(accessToken, tokenValidationParameters, out var securityToken);

        // Cast the security token to a JwtSecurityToken for further validation.

        var jwtSecurityToken = securityToken as JwtSecurityToken;

        // Ensure the token is a valid JWT and uses the HmacSha256 signing algorithm.
        // If no throw new SecurityTokenException
        if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals
                (SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            throw new SecurityTokenException("Invalid token");

        // return the principal
        return principal;
    }
}