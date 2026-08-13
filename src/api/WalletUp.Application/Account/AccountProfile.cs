using AutoMapper;
using WalletUp.Application.Account.Commands.CreateAccount;
using WalletUp.Application.Account.Dtos;
using WalletUp.Domain.Entities;

namespace WalletUp.Application.Account;

public class AccountProfile:Profile
{
    public AccountProfile()
    {
        CreateMap<CreateAccountCommand,WalletUp.Domain.Entities.Account>();
        CreateMap<WalletUp.Domain.Entities.Account,AccountDto>()
            .ForMember(dest => dest.AccountType, opt => opt.MapFrom(src => src.AccountType))
            .ForMember(dest => dest.Currency, opt => opt.MapFrom(src => src.Currency))
            .ForMember(dest => dest.Balance, opt => opt.Ignore());
        
        
        CreateMap<AccountType,AccountTypeDto>();
    }
}