using Microsoft.EntityFrameworkCore;
using WalletUp.Infstructre.Identity.Models;

namespace CashCat.Infstructre.Persistence.Repositories;

public class UserTokenRepository:Repository<ApplicationUserToken>,IUserTokenRepository
{
    public UserTokenRepository(CashCatDbContext context) : base(context)
    {
    }

    public ApplicationUserToken  GetByUserId(Guid userId)
    {
         var userToken=   _dbSet.FirstOrDefault(x => x.UserId == userId);
         return userToken;
    }

    public ApplicationUserToken GetByToken(string refreshToken)
    {
        var userToken = _dbSet.FirstOrDefault(x => x.Value == refreshToken);
        return userToken;
    }

    public int DeleteByUserId(Guid userId)
    {
         return _dbSet.Where(x => x.UserId == userId).ExecuteDelete();
    }
}