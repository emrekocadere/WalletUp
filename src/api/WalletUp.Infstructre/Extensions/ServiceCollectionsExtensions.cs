using System.Text;
using WalletUp.Domain.Repositories;
using WalletUp.Application.Common.Services;
using WalletUp.Application.Identity;
using WalletUp.Domain.Entities;
using WalletUp.Domain.Services;
using CashCat.Infstructre.Auth.Services;
using CashCat.Infstructre.Identity;
using CashCat.Infstructre.Persistence;
using CashCat.Infstructre.Persistence.Repositories;
using CashCat.Infstructre.Refit;
using CashCat.Infstructre.Services;
using Microsoft.Extensions.Caching.Distributed;
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

        services.AddDbContext<CashCatDbContext>(opt => { opt.UseNpgsql(connectionString); });

        services.AddIdentity<ApplicationUser, ApplicationRole>()
            .AddEntityFrameworkStores<CashCatDbContext>();

        services.AddScoped<IPrefrenceRepository, PrefrenceRepository>();
        services.AddHttpContextAccessor();
        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<IUserContext, UserContext>();
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IRepository<Transaction>, Repository<Transaction>>();
        services.AddScoped<IRepository<Preference>, Repository<Preference>>();
        services.AddScoped<IRepository<Goal>, Repository<Goal>>();  
        services.AddScoped<IRepository<AccountType>, Repository<AccountType>>();
        services.AddScoped<IRepository<GoalTransaction>, Repository<GoalTransaction>>();
        services.AddScoped<IRepository<Currency>, Repository<Currency>>();
        services.AddScoped<IRepository<TransactionType>, Repository<TransactionType>>();
        services.AddScoped<IUserTokenRepository, UserTokenRepository>();
        services.AddScoped<IRepository<Account>, Repository<Account>>();
        services.AddScoped<IRepository<Country>, Repository<Country>>();
        services.AddScoped<IRepository<Category>, Repository<Category>>();
        services.AddScoped<ITransactionRepository, TransactionRepository>();
        services.AddScoped<IGoalRepository, GoalRepository>();
        services.AddScoped<IGoalTransactionRepository, GoalTransactionRepository>();
        services.AddScoped<IExchangeRateService, ExchangeRateService>();
        
        services.AddRefitClient<IExchangeApi>()
            . ConfigureHttpClient(c => c.BaseAddress = new Uri(configuration["CurrenviaBaseUrl"]!));
        
        services.AddScoped<IInsightService, InsightService>();
        services.AddSingleton<ICacheService, RedisCacheService>();

        var redisConnection = configuration.GetConnectionString("Redis");

        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = redisConnection;
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
    
                options.TokenValidationParameters = new TokenValidationParameters //Gelen token’ı TokenValidationParameters kurallarına göre kontrol edecek:
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



    }
    
        public static void UseInfrastructure(this IApplicationBuilder app)
    {
        app.UseAuthentication();
        app.UseAuthorization();
    }
}