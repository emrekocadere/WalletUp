using AutoMapper;
using WalletUp.Application.Abstractions;
using WalletUp.Domain.Common;
using MediatR;
using WalletUp.Application.Transaction.Dtos;

namespace WalletUp.Application.Transaction.Queries.GetCategories;

public class GetCategoriesQueryHandler(
    IMapper mapper,
    IApplicationDbContext dbContext)
    :IRequestHandler<GetCategoriesQuery, ResultT<ICollection<CategoryDto>>>
{
    public Task<ResultT<ICollection<CategoryDto>>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = dbContext.Categories.ToList();
        var categoryDtos = mapper.Map<List<CategoryDto>>(categories);
        return Task.FromResult<ResultT<ICollection<CategoryDto>>>(categoryDtos);
    }
}
