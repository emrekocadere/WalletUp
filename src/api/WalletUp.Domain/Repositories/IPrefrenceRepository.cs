using WalletUp.Domain.Entities;

namespace WalletUp.Domain.Repositories;

public interface IPrefrenceRepository : IRepository<Preference>
{
    Preference? GetByUserId(Guid userId);

    void Update(Guid userId,Guid? currencyId,Guid? countryId, string? occupation, double? monthlyIncome, string? language);
}