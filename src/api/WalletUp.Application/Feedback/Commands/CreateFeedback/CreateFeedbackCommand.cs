using MediatR;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Feedback.Commands.CreateFeedback;

public record CreateFeedbackCommand(string Message) : IRequest<Result>;
