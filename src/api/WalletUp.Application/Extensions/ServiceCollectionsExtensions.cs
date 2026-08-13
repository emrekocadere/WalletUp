using Microsoft.Extensions.DependencyInjection;
using WalletUp.Application.RecurringTransaction.Services;

namespace WalletUp.Application.Extensions;

public static class ServiceCollectionsExtensions
{
    public static void AddApplication(this IServiceCollection services)
    {
        var applicationAssembly = typeof(ServiceCollectionsExtensions).Assembly;
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(applicationAssembly));

        services.AddAutoMapper(cfg => { }, applicationAssembly);

        services.AddScoped<IRecurringTransactionProcessor, RecurringTransactionProcessor>();
    }
}