using MediatR;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Common.Services;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Feedback.Commands.CreateFeedback;

public class CreateFeedbackCommandHandler(
    IApplicationDbContext dbContext,
    IUserContext userContext)
    : IRequestHandler<CreateFeedbackCommand, Result>
{
    public async Task<Result> Handle(CreateFeedbackCommand request, CancellationToken cancellationToken)
    {
        var feedback = new WalletUp.Domain.Entities.Feedback
        {
            Id = Guid.NewGuid(),
            UserId = userContext.UserId,
            Message = request.Message,
            CreatedAt = DateTime.UtcNow
        };

        dbContext.Feedbacks.Add(feedback);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
