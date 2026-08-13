using MediatR;
using WalletUp.Application.Report.Dtos;
using WalletUp.Domain.Common;

namespace WalletUp.Application.Report.Queries.GetAnnualReport;

public record GetAnnualReportQuery(int Year) : IRequest<ResultT<AnnualReportDto>>;
