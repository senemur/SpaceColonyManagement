using System.Linq.Expressions;
using Core.Persistence.Paging;
using Domain.Entities;

namespace Application.Services.BuildingService;

public interface IBuildingService
{
    Task<Building?> GetAsync(
        Expression<Func<Building, bool>> predicate,
        CancellationToken cancellationToken = default
    );

    Task<IPaginate<Building>> GetListAsync(
        Expression<Func<Building, bool>>? predicate = null,
        Func<IQueryable<Building>, IOrderedQueryable<Building>>? orderBy = null,
        int index = 0,
        int size = 10,
        CancellationToken cancellationToken = default
    );

    Task<Building> AddAsync(Building building);
    Task<Building> UpdateAsync(Building building);
    Task<Building> DeleteAsync(Building building, bool permanent = false);
}
