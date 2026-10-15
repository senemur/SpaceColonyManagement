namespace Application.Features.Colonists.Queries.GetListByColonyId;

using Application.Services.ColonistService;
using AutoMapper;
using Core.Application.Responses;
using Core.Persistence.Paging;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetListByColonyIdColonistQuery
    : IRequest<GetListResponse<GetListByColonyIdColonistListItemDto>>
{
    public int ColonyId { get; set; }
    public int Index { get; set; } = 0;
    public int Size { get; set; } = 50;

    public class GetListByColonyIdColonistQueryHandler(
        IColonistService colonistService,
        IMapper mapper
    )
        : IRequestHandler<
            GetListByColonyIdColonistQuery,
            GetListResponse<GetListByColonyIdColonistListItemDto>
        >
    {
        public async Task<GetListResponse<GetListByColonyIdColonistListItemDto>> Handle(
            GetListByColonyIdColonistQuery request,
            CancellationToken cancellationToken
        )
        {
            IPaginate<Colonist> colonists = await colonistService.GetListAsync(
                predicate: c => c.ColonyId == request.ColonyId,
                index: request.Index,
                size: request.Size,
                cancellationToken: cancellationToken
            );

            return mapper.Map<GetListResponse<GetListByColonyIdColonistListItemDto>>(colonists);
        }
    }
}
