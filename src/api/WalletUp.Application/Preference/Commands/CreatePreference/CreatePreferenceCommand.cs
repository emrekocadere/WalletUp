using MediatR;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Preference.Commands.CreatePreference;

public record CreatePreferenceCommand(Guid CurrencyId, Guid CountryId, string? Occupation, double? MonthlyIncome, string? Language)
    : IRequest<Result>;