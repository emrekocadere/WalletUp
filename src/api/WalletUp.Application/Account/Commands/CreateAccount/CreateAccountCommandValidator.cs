using FluentValidation;

namespace WalletUp.Application.Account.Commands.CreateAccount;

public class CreateAccountCommandValidator : AbstractValidator<CreateAccountCommand>
{
    public CreateAccountCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
        RuleFor(x => x.CurrencyId).NotEmpty();
        RuleFor(x => x.AccountTypeId).NotEmpty();
    }
}
