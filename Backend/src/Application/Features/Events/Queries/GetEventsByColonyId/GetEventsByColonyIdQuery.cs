namespace Application.Features.Events.Queries.GetEventsByColonyId;

using Application.Services.Repositories;
using MediatR;

public class GetEventsByColonyIdQuery : IRequest<List<ColonyEventDto>>
{
    public int ColonyId { get; set; } = 1;
    public int Size { get; set; } = 50;

    public class GetEventsByColonyIdQueryHandler(
        IColonyEventRepository colonyEventRepository
    ) : IRequestHandler<GetEventsByColonyIdQuery, List<ColonyEventDto>>
    {
        public async Task<List<ColonyEventDto>> Handle(
            GetEventsByColonyIdQuery request,
            CancellationToken cancellationToken
        )
        {
            var result = await colonyEventRepository.GetListAsync(
                predicate: e => e.ColonyId == request.ColonyId,
                orderBy: q => q.OrderByDescending(e => e.Sol).ThenByDescending(e => e.Id),
                size: request.Size,
                cancellationToken: cancellationToken
            );

            return result.Items
                .OrderByDescending(e => e.Sol)
                .ThenByDescending(e => e.Id)
                .Select(ColonyEventDto.FromEntity)
                .ToList();
        }
    }
}
