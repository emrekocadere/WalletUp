using MediatR;
using WalletUp.Application.Common.Services;
using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;

namespace WalletUp.Application.Preference.Commands.UpdatePreference;

public class UpdatePreferenceCommandHandler(
    IUserContext userContext,
    IPrefrenceRepository prefrenceRepository)
    :IRequestHandler<UpdatePreferenceCommand,Result>
{
    public async Task<Result> Handle(UpdatePreferenceCommand request, CancellationToken cancellationToken)
    {
            prefrenceRepository.Update(userContext.UserId,
            request.CurrencyId,
            request.CountryId,
            request.Occupation,
            request.MonthlyIncome,
            request.Language);
        
        await   prefrenceRepository.SaveChanges();
        
        return Result.Success();
        
    }
}