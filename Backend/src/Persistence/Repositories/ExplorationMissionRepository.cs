namespace Persistence.Repositories;

using Application.Services.Repositories;
using Core.Persistence.Repositories;
using Domain.Entities;
using Persistence.Contexts;

public class ExplorationMissionRepository(BaseDbContext context)
    : EfRepositoryBase<ExplorationMission, int, BaseDbContext>(context),
        IExplorationMissionRepository { }
