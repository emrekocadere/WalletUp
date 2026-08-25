using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using WalletUp.Application.Common.Behaviors;
using WalletUp.Application.RecurringTransaction.Services;

namespace WalletUp.Application.Extensions;

public static class ServiceCollectionsExtensions
{
    public static void AddApplication(this IServiceCollection services)
    {
        var applicationAssembly = typeof(ServiceCollectionsExtensions).Assembly;
        services.AddValidatorsFromAssembly(applicationAssembly);
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(applicationAssembly);
            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        services.AddAutoMapper(cfg => { }, applicationAssembly);

        services.AddScoped<IRecurringTransactionProcessor, RecurringTransactionProcessor>();
    }
}