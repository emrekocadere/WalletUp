using MediatR;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Identity.Commands.Logout;

public record class LogoutCommand:IRequest<Result>;