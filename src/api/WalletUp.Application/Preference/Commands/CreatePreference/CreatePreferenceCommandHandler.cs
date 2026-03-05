using AutoMapper;
using MediatR;
using WalletUp.Application.Common.Services;
using WalletUp.Application.Identity;
using WalletUp.Domain.Common;
using WalletUp.Domain.Repositories;

namespace WalletUp.Application.Preference.Commands.CreatePreference;

public class CreatePreferenceCommandHandler(
    IRepository<Domain.Entities.Preference> preferenceRepository,
    IMapper mapper,
    IUserContext userContext,
    IIdentityService identityService)
    : IRequestHandler<CreatePreferenceCommand, Result>
{
    public async Task<Result> Handle(CreatePreferenceCommand request, CancellationToken cancellationToken)
    {
        var preference = mapper.Map<Domain.Entities.Preference>(request);
        preference.UserId = userContext.UserId;
        await preferenceRepository.Create(preference);
        await preferenceRepository.SaveChanges();
        await identityService.CompleteOnboarding(userContext.UserId);
        return Result.Success();
    }
}