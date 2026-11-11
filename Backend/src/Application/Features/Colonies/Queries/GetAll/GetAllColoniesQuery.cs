namespace Application.Features.Colonies.Queries.GetAll;

using Application.Features.Colonies.Queries.GetOverview;
using Application.Services;
using AutoMapper;
using MediatR;

public class GetAllColoniesQuery : IRequest<List<GetColonyOverviewResponse>>
{
    public class GetAllColoniesQueryHandler(IColonyService colonyService, IMapper mapper)
        : IRequestHandler<GetAllColoniesQuery, List<GetColonyOverviewResponse>>
    {
        public async Task<List<GetColonyOverviewResponse>> Handle(
            GetAllColoniesQuery request,
            CancellationToken cancellationToken
        )
        {
            var colonies = await colonyService.GetAllAsync(cancellationToken);
            return mapper.Map<List<GetColonyOverviewResponse>>(colonies.ToList());
        }
    }
}
