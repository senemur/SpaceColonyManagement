using System.Linq.Expressions;
using Application.Services.Repositories;
using Core.Persistence.Paging;
using Domain.Entities;

namespace Application.Services.BuildingService;

public class BuildingManager(IBuildingRepository buildingRepository) : IBuildingService
{
    public async Task<Building?> GetAsync(
        Expression<Func<Building, bool>> predicate,
        CancellationToken cancellationToken = default
    )
    {
        return await buildingRepository.GetAsync(predicate, cancellationToken: cancellationToken);
    }

    public async Task<IPaginate<Building>> GetListAsync(
        Expression<Func<Building, bool>>? predicate = null,
        Func<IQueryable<Building>, IOrderedQueryable<Building>>? orderBy = null,
        int index = 0,
        int size = 10,
        CancellationToken cancellationToken = default
    )
    {
        return await buildingRepository.GetListAsync(
            predicate,
            orderBy,
            index: index,
            size: size,
            cancellationToken: cancellationToken
        );
    }

    public async Task<Building> AddAsync(Building building)
    {
        return await buildingRepository.AddAsync(building);
    }

    public async Task<Building> UpdateAsync(Building building)
    {
        return await buildingRepository.UpdateAsync(building);
    }

    public async Task<Building> DeleteAsync(Building building, bool permanent = false)
    {
        return await buildingRepository.DeleteAsync(building, permanent);
    }
}
