using MediatR;
using WalletUp.Domain.Common;
using WalletUp.Domain.Entities;

namespace WalletUp.Application.RecurringTransaction.Commands.UpdateRecurringTransaction;

public record UpdateRecurringTransactionCommand(
    Guid Id,
    string Title,
    string? Description,
    double Amount,
    Guid CategoryId,
    Guid TransactionTypeId,
    RecurrenceFrequency Frequency,
    DateTime StartDate,
    DateTime? EndDate,
    bool IsActive
) : IRequest<Result>;
