using System.Reflection;
using FluentValidation;
using MediatR;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Common.Behaviors;

public class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : Result
{
    private static readonly MethodInfo FailureConverter = typeof(TResponse)
        .GetMethod("op_Implicit", [typeof(Error)])
        ?? throw new InvalidOperationException($"{typeof(TResponse).Name} must define an implicit conversion from Error.");

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (!validators.Any())
            return await next();

        var context = new ValidationContext<TRequest>(request);
        var failures = (await Task.WhenAll(validators.Select(v => v.ValidateAsync(context, cancellationToken))))
            .SelectMany(r => r.Errors)
            .ToList();

        if (failures.Count == 0)
            return await next();

        var message = string.Join(" ", failures.Select(f => f.ErrorMessage));
        return (TResponse)FailureConverter.Invoke(null, [Errors.Validation(message)])!;
    }
}
