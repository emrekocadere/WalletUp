using AutoMapper;
using MediatR;
using WalletUp.Application.Abstractions;
using WalletUp.Application.Common.Services;
using WalletUp.Application.Identity;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Preference.Commands.CreatePreference;

public class CreatePreferenceCommandHandler(
    IApplicationDbContext dbContext,
    IMapper mapper,
    IUserContext userContext,
    IIdentityService identityService)
    : IRequestHandler<CreatePreferenceCommand, Result>
{
    public async Task<Result> Handle(CreatePreferenceCommand request, CancellationToken cancellationToken)
    {
        var preference = mapper.Map<Domain.Entities.Preference>(request);
        preference.UserId = userContext.UserId;
        dbContext.Preferences.Add(preference);
        await dbContext.SaveChangesAsync(cancellationToken);
        await identityService.CompleteOnboarding(userContext.UserId);
        return Result.Success();
    }
}