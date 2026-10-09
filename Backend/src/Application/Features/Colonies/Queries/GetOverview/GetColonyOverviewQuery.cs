namespace Application.Features.Colonies.Queries.GetOverview;

using Application.Features.Colonies.Rules;
using Application.Services;
using AutoMapper;
using Domain.Entities;
using MediatR;

public class GetColonyOverviewQuery : IRequest<GetColonyOverviewResponse>
{
    public int Id { get; set; }

    public class GetColonyOverviewQueryHandler
        : IRequestHandler<GetColonyOverviewQuery, GetColonyOverviewResponse>
    {
        private readonly IColonyService _colonyService;
        private readonly IMapper _mapper;
        private readonly ColonyBusinessRules _colonyBusinessRules;

        public GetColonyOverviewQueryHandler(
            IColonyService colonyService,
            IMapper mapper,
            ColonyBusinessRules colonyBusinessRules
        )
        {
            _colonyService = colonyService;
            _mapper = mapper;
            _colonyBusinessRules = colonyBusinessRules;
        }

        public async Task<GetColonyOverviewResponse> Handle(
            GetColonyOverviewQuery request,
            CancellationToken cancellationToken
        )
        {
            Colony? colony = await _colonyService.GetByIdAsync(request.ColonyId, cancellationToken);
            await _colonyBusinessRules.ColonyShouldExistWhenRequested(colony);

            GetColonyOverviewResponse response = _mapper.Map<GetColonyOverviewResponse>(colony);
            return response;
        }
    }
}
