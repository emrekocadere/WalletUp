using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WalletUp.Domain.Entities;

namespace CashCat.Infstructre.Persistence.Seeders;

public class DatabaseSeeder(CashCatDbContext db)
{
    public async Task SeedAsync()
    {
            await SeedCurrenciesAsync();
            await SeedCategoriesAsync();
            await SeedCountriesAsync();
            await SeedAccountTypesAsync();
            await SeedTransactionTypesAsync();
    }

    private async Task SeedCurrenciesAsync()
    {
        if (await db.Currencies.AnyAsync())
        {
            return;
        }

        db.Currencies.AddRange(
            new Currency { ISO4217Code = "GBP" },
            new Currency { ISO4217Code = "EUR" },
            new Currency { ISO4217Code = "CHF" },
            new Currency { ISO4217Code = "NOK" },
            new Currency { ISO4217Code = "SEK" },
            new Currency { ISO4217Code = "DKK" },
            new Currency { ISO4217Code = "CZK" }
        );

        await db.SaveChangesAsync();
    }

    private async Task SeedCategoriesAsync()
    {
        if (await db.Categories.AnyAsync())
        {
            return;
        }

        db.Categories.AddRange(
            new Category { Name = "Others" },
            new Category { Name = "Travel" },
            new Category { Name = "Bills" },
            new Category { Name = "Health" },
            new Category { Name = "Shopping" },
            new Category { Name = "Transportation" },
            new Category { Name = "Food & Drinks" }
        );

        await db.SaveChangesAsync();
    }

    private async Task SeedCountriesAsync()
    {
        if (await db.Countries.AnyAsync())
        {
            return;
        }

        db.Countries.AddRange(
            new Country { Name = "Germany" },
            new Country { Name = "France" },
            new Country { Name = "Italy" },
            new Country { Name = "Spain" },
            new Country { Name = "Netherlands" },
            new Country { Name = "Belgium" },
            new Country { Name = "Switzerland" },
            new Country { Name = "Austria" },
            new Country { Name = "Poland" },
            new Country { Name = "Greece" }
        );

        await db.SaveChangesAsync();
    }
    
    private async Task SeedAccountTypesAsync()
    {
        if (await db.AccountTypes.AnyAsync())
        {
            return;
        }

        db.AccountTypes.AddRange(
            new AccountType() { Name = "Cash" },
            new AccountType { Name = "Credit Card" },
            new AccountType { Name = "Savings" },
            new AccountType { Name = "Bank Account" }
        );

        await db.SaveChangesAsync();
    }
    
    private async Task SeedTransactionTypesAsync()
    {
        if (await db.TransactionTypes.AnyAsync())
        {
            return;
        }

        db.TransactionTypes.AddRange(
            new TransactionType() { Name = "income" },
            new TransactionType { Name = "expense" }
        );

        await db.SaveChangesAsync();
    }
}

