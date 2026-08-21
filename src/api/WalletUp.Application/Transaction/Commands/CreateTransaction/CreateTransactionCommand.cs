using WalletUp.Domain.Common;
using MediatR;

namespace WalletUp.Application.Transaction.Commands.CreateTransaction;

public record CreateTransactionCommand : IRequest<Result>
{
    public Guid AccountId { get; init; }
    public Guid CategoryId { get; init; }
    public Guid TransactionTypeId { get; init; }
    public double Amount { get; init; }
    public string? Title { get; init; }
    public string? Description { get; init; }
}