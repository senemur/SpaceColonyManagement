using Core.Persistence.Repositories;
using Domain.Entities;

namespace Application.Services.Repositories;

public interface IExplorationMissionRepository
    : IAsyncRepository<ExplorationMission, int>,
        IRepository<ExplorationMission, int> { }
