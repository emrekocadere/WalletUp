using Microsoft.EntityFrameworkCore;
using WalletUp.Domain.Entities;
using WalletUp.Domain.Repositories;

namespace CashCat.Infstructre.Persistence.Repositories;

public class PreferenceRepository:Repository<Preference>,IPreferenceRepository
{
    public PreferenceRepository(CashCatDbContext context) : base(context)
    {
    }

    public string GetPreferredCurrencyByUserId(Guid userId)
    {
        return _dbSet.AsNoTracking()
            .Where(x => x.UserId == userId)
            .Select(x=>x.Currency.ISO4217Code)
            .FirstOrDefault();
    }
}