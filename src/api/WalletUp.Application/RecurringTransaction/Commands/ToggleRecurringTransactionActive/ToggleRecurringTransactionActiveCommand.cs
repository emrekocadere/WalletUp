using MediatR;
using WalletUp.Domain.Common;

namespace WalletUp.Application.RecurringTransaction.Commands.ToggleRecurringTransactionActive;

public record ToggleRecurringTransactionActiveCommand(Guid Id) : IRequest<Result>;
