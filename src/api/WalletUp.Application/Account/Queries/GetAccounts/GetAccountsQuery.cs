using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Account.Dtos;

namespace WalletUp.Application.Account.Queries.GetAccounts;

public record GetAccountsQuery():IRequest<ResultT<GetAccountsResponse>>;