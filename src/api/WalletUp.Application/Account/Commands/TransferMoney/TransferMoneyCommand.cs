using MediatR;
using WalletUp.Application.Account.Dtos;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Account.Commands.TransferMoney;

public record TransferMoneyCommand(Guid FromAccountId, Guid ToAccountId, double Amount, string? Description)
    : IRequest<ResultT<TransferMoneyResponse>>;
