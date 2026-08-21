using MediatR;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Transaction.Commands.UpdateTransaction;

public class UpdateTransactionCommandHandler(
    IApplicationDbContext dbContext)
    :IRequestHandler<UpdateTransactionCommand,Result>
{
    public async Task<Result> Handle(UpdateTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = await dbContext.Transactions.FindAsync(new object[] { request.TransactionId }, cancellationToken);
        if (request.Title != null)
        {
            transaction.Title = request.Title;
        }
        if(request.Description!= null)
        {
            transaction.Description = request.Description;
        }

        if (request.CategoryId != null)
        {
            transaction.CategoryId= request.CategoryId.Value;
        }
        
        if (request.Date != null)
        {
            transaction.Date= request.Date.Value;
        }

        
        if (request.TransactionTypeId != null)
        {
            transaction.TransactionTypeId= request.TransactionTypeId.Value;
        }

        

        await dbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}