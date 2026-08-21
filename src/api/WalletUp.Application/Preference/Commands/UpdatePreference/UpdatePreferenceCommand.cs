using MediatR;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Preference.Commands.UpdatePreference;

public record UpdatePreferenceCommand(
    Guid? CurrencyId,
    Guid? CountryId,
    string? Occupation,
    double? MonthlyIncome,
    string? Language):IRequest<Result>;
    
    
    
    
