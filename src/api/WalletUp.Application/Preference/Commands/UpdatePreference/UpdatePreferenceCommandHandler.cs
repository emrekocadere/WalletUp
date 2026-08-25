using MediatR;
using Microsoft.EntityFrameworkCore;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Common.Services;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Preference.Commands.UpdatePreference;

public class UpdatePreferenceCommandHandler(
    IUserContext userContext,
    IApplicationDbContext dbContext)
    :IRequestHandler<UpdatePreferenceCommand,Result>
{
    public async Task<Result> Handle(UpdatePreferenceCommand request, CancellationToken cancellationToken)
    {
        var preference = await dbContext.Preferences.FirstOrDefaultAsync(x => x.UserId == userContext.UserId, cancellationToken);

        if (preference is null)
            return Errors.PreferenceNotFound;

        if (request.CurrencyId.HasValue)
        {
            preference.CurrencyId = request.CurrencyId.Value;
        }

        if (request.CountryId.HasValue)
        {
            preference.CountryId = request.CountryId.Value;
        }

        if (request.Occupation != null)
        {
            preference.Occupation = request.Occupation;
        }

        if (request.MonthlyIncome.HasValue)
        {
            preference.MonthlyIncome = request.MonthlyIncome.Value;
        }

        if (request.Language != null)
        {
            preference.Language = request.Language;
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();

    }
}