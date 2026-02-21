namespace WalletUp.Domain.Repositories;

public interface IPreferenceRepository
{ 
    string GetPreferredCurrencyByUserId(Guid userId);
}