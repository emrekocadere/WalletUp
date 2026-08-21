using System.Diagnostics;
using System.Text.Json.Serialization;
using Hangfire;
using Microsoft.AspNetCore.HttpOverrides;
using CashCat.Infstructre.Persistence;
using WalletUp.Application.RecurringTransaction.Services;
using WalletUp.Infstructre.Extensions;
using WalletUp.Application.Extensions;
using CashCat.Integrations;
using Serilog;
using SerilogTracing;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3001",
                "http://localhost:3000",
                "https://walletup.io",
                "https://www.walletup.io"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
builder.Host.UseSerilog((context, services, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        // Npgsql emits its own Activity per SQL command; the ActivityListener below picks it up
        // regardless of .Instrument.AspNetCoreRequests()/.HttpClientRequests(), flooding the
        // console with one bare "postgresql" line per query. Keep it, just don't log it by default.
        .MinimumLevel.Override("Npgsql", Serilog.Events.LogEventLevel.Warning)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .WriteTo.Seq(
            serverUrl: context.Configuration["Seq:Url"]!,
            apiKey: "admin:emre1234"!
        );
});

using var _ = new ActivityListenerConfiguration()
    .Instrument.AspNetCoreRequests()
    .Instrument.HttpClientRequests()
    .TraceToSharedLogger();

builder.Services.AddInfrastructureServices(builder.Configuration);

builder.Services.AddApplication();
builder.Services.AddWalletUpInsight(builder.Configuration);

var app = builder.Build();

// Initialize database: apply migrations and seed reference data
await app.InitializeDatabaseAsync();

// Configure the HTTP request pipeline.

    app.UseSwagger();
    app.UseSwaggerUI();

// The API runs behind a reverse proxy that terminates TLS for api.walletup.io.
// Without this, UseHttpsRedirection below thinks every request is plain HTTP
// and issues a redirect *before* the CORS middleware can add its headers,
// which is exactly what the browser reports as a missing CORS header.
var forwardedHeadersOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
};
// The proxy isn't on loopback, so clear the default restriction to actually trust it.
forwardedHeadersOptions.KnownNetworks.Clear();
forwardedHeadersOptions.KnownProxies.Clear();
app.UseForwardedHeaders(forwardedHeadersOptions);

// CORS must run before the HTTPS redirect so that even a redirect response
// (or any early short-circuit) still carries the Access-Control-Allow-Origin header.
app.UseCors("AllowClient");

app.UseHttpsRedirection();

app.UseInfrastructure();

app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseHangfireDashboard();
}

using (var scope = app.Services.CreateScope())
{
    var recurringJobManager = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();
    recurringJobManager.AddOrUpdate<IRecurringTransactionProcessor>(
        "process-due-recurring-transactions",
        processor => processor.ProcessDueRecurringTransactionsAsync(CancellationToken.None),
        Cron.Daily);
}

app.Run();
