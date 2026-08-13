using AutoMapper;
using WalletUp.Application.RecurringTransaction.Commands.CreateRecurringTransaction;
using WalletUp.Application.RecurringTransaction.Dtos;

namespace WalletUp.Application.RecurringTransaction;

public class RecurringTransactionProfile : Profile
{
    public RecurringTransactionProfile()
    {
        CreateMap<CreateRecurringTransactionCommand, Domain.Entities.RecurringTransaction>();

        CreateMap<Domain.Entities.RecurringTransaction, RecurringTransactionDto>()
            .ForMember(dest => dest.Frequency, opt => opt.MapFrom(src => src.Frequency.ToString()))
            .ForMember(dest => dest.Account, opt => opt.MapFrom(src => src.Account))
            .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
            .ForMember(dest => dest.TransactionType, opt => opt.MapFrom(src => src.TransactionType));
    }
}
