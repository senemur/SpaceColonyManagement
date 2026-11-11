namespace Application.Features.Exploration.Queries.GetMissionsByColonyId;

using Application.Services.Repositories;
using MediatR;

public class GetMissionsByColonyIdQuery : IRequest<List<ExplorationMissionDto>>
{
    public int ColonyId { get; set; } = 1;
    public int Size { get; set; } = 50;

    public class GetMissionsByColonyIdQueryHandler(
        IExplorationMissionRepository explorationMissionRepository
    ) : IRequestHandler<GetMissionsByColonyIdQuery, List<ExplorationMissionDto>>
    {
        public async Task<List<ExplorationMissionDto>> Handle(
            GetMissionsByColonyIdQuery request,
            CancellationToken cancellationToken
        )
        {
            var result = await explorationMissionRepository.GetListAsync(
                predicate: m => m.ColonyId == request.ColonyId,
                size: request.Size,
                cancellationToken: cancellationToken
            );

            return result.Items
                .OrderBy(m => m.Status)
                .ThenBy(m => m.Id)
                .Select(ExplorationMissionDto.FromEntity)
                .ToList();
        }
    }
}
