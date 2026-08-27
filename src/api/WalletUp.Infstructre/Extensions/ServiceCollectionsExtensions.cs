using System.Text;
using Hangfire;
using Hangfire.PostgreSql;
using WalletUp.Application.Common.Services;
using WalletUp.Application.Identity;
using WalletUp.Domain.Services;
using CashCat.Infstructre.Auth.Services;
using CashCat.Infstructre.Email;
using CashCat.Infstructre.Identity;
using CashCat.Infstructre.Persistence;
using CashCat.Infstructre.Persistence.Seeders;
using CashCat.Infstructre.Refit;
using CashCat.Infstructre.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Refit;
using WalletUp.Application.Abstractions;
using WalletUp.Infstructre.Identity.Models;

namespace WalletUp.Infstructre.Extensions;

public static class ServiceCollectionsExtensions
{
    public static void AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<CashCatDbContext>(opt =>
        {
            opt.UseNpgsql(connectionString);
        });

        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<CashCatDbContext>());

        services.AddScoped<DatabaseSeeder>();


        services.AddIdentity<ApplicationUser, ApplicationRole>()
            .AddEntityFrameworkStores<CashCatDbContext>();

        services.AddHttpContextAccessor();

        services.AddScoped<IUserContext, UserContext>();

        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<IEmailService, SmtpEmailService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IExchangeRateService, ExchangeRateService>();

        services.AddRefitClient<IExchangeApi>()
            .ConfigureHttpClient(c => c.BaseAddress = new Uri(configuration["CurrenviaBaseUrl"]!));

        services.AddScoped<IInsightService, InsightService>();
        services.AddSingleton<ICacheService, RedisCacheService>();

        var redisConnection = configuration.GetConnectionString("Redis");

        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = $"{redisConnection},password=admin";
        });

        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = configuration["JWT:ValidAudience"],
                    ValidIssuer = configuration["JWT:ValidIssuer"],
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))
                };
            });

        var applicationAssembly = typeof(ServiceCollectionsExtensions).Assembly;
        services.AddAutoMapper(cfg => { }, applicationAssembly);

        services.AddHangfire(cfg => cfg
            .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
            .UseSimpleAssemblyNameTypeSerializer()
            .UseRecommendedSerializerSettings()
            .UsePostgreSqlStorage(opt => opt.UseNpgsqlConnection(connectionString)));
        services.AddHangfireServer();
    }

    public static void UseInfrastructure(this IApplicationBuilder app)
    {
        app.UseAuthentication();
        app.UseAuthorization();
    }
}
