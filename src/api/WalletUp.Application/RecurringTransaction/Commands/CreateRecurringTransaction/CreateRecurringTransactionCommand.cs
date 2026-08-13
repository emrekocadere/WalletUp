using MediatR;
using WalletUp.Domain.Common;
using WalletUp.Domain.Entities;

namespace WalletUp.Application.RecurringTransaction.Commands.CreateRecurringTransaction;

public record CreateRecurringTransactionCommand(
    string Title,
    string? Description,
    double Amount,
    Guid AccountId,
    Guid CategoryId,
    Guid TransactionTypeId,
    RecurrenceFrequency Frequency,
    DateTime StartDate,
    DateTime? EndDate
) : IRequest<Result>;
