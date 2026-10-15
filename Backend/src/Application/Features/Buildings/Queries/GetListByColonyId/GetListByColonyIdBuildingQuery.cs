using Application.Services.BuildingService;
using AutoMapper;
using Core.Application.Responses;
using Core.Persistence.Paging;
using Domain.Entities;
using MediatR;

namespace Application.Features.Buildings.Queries.GetListByColonyId;

public class GetListByColonyIdBuildingQuery
    : IRequest<GetListResponse<GetListByColonyIdBuildingListItemDto>>
{
    public int ColonyId { get; set; }
    public int Index { get; set; } = 0;
    public int Size { get; set; } = 50;

    public class GetListByColonyIdBuildingQueryHandler(
        IBuildingService buildingService,
        IMapper mapper
    )
        : IRequestHandler<
            GetListByColonyIdBuildingQuery,
            GetListResponse<GetListByColonyIdBuildingListItemDto>
        >
    {
        public async Task<GetListResponse<GetListByColonyIdBuildingListItemDto>> Handle(
            GetListByColonyIdBuildingQuery request,
            CancellationToken cancellationToken
        )
        {
            IPaginate<Building> buildings = await buildingService.GetListAsync(
                predicate: b => b.ColonyId == request.ColonyId,
                index: request.Index,
                size: request.Size,
                cancellationToken: cancellationToken
            );

            return mapper.Map<GetListResponse<GetListByColonyIdBuildingListItemDto>>(buildings);
        }
    }
}
