using WalletUp.Domain.Repositories;
using WalletUp.Infstructre.Identity.Models;

namespace CashCat.Infstructre.Persistence.Repositories;

public interface IUserTokenRepository:IRepository<ApplicationUserToken>
{
    ApplicationUserToken GetByUserId(Guid userId);
    ApplicationUserToken GetByToken(string refreshToken);
    int DeleteByUserId(Guid userId);
}