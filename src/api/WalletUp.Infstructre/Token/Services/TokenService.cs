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
            Expires = DateTime.Now.AddMinutes(15),
            SigningCredentials = new SigningCredentials
                (authSigningKey, SecurityAlgorithms.HmacSha256)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
    }

}