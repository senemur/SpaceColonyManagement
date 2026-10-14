namespace Persistence.Repositories;

using Application.Services.Repositories;
using Core.Persistence.Repositories;
using Domain.Entities;
using Persistence.Contexts;

public class BuildingRepository(BaseDbContext context)
    : EfRepositoryBase<Building, int, BaseDbContext>(context),
        IBuildingRepository { }
