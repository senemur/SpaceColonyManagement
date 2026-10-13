using Core.Persistence.Repositories;
using Domain.Entities;

namespace Application.Services.Repositories;

public interface IBuildingRepository
    : IAsyncRepository<Building, int>,
        IRepository<Building, int> { }
