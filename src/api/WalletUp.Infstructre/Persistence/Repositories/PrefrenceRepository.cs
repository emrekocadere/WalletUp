using Microsoft.EntityFrameworkCore;
using WalletUp.Domain.Entities;
using WalletUp.Domain.Repositories;

namespace CashCat.Infstructre.Persistence.Repositories;

public class PrefrenceRepository : Repository<Preference>, IPrefrenceRepository
{
    public PrefrenceRepository(CashCatDbContext context) : base(context)
    {
    }

    public Preference? GetByUserId(Guid userId)
    {
        return _dbSet
            .AsNoTracking()
            .Include(x=>x.Currency)
            .Include(x=>x.Country)
            .FirstOrDefault(x => x.UserId == userId);
    }

    public void Update(Guid userId, Guid? currencyId, Guid? countryId, string? occupation, double? monthlyIncome)
    {
        var preference = _dbSet.FirstOrDefault(x => x.UserId == userId);
        
        if(preference == null)
        {
            return;
        }
        
        if (currencyId.HasValue)
        {
            preference.CurrencyId = currencyId.Value;
        }

        if (countryId.HasValue)
        {
            preference.CountryId = countryId.Value;
        }
        
        if (occupation != null)
        {
            preference.Occupation = occupation;
        }
        
        if (monthlyIncome.HasValue)
        {
            preference.MonthlyIncome = monthlyIncome.Value;
        }
    }
}