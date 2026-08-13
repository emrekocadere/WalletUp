using MediatR;
using WalletUp.Domain.Common;

namespace WalletUp.Application.RecurringTransaction.Commands.DeleteRecurringTransaction;

public record DeleteRecurringTransactionCommand(Guid Id) : IRequest<Result>;
