using System.Linq.Expressions;
using Core.Persistence.Paging;
using Domain.Entities;

namespace Application.Services.ColonistService;

public interface IColonistService
{
    Task<Colonist?> GetAsync(
        Expression<Func<Colonist, bool>> predicate,
        CancellationToken cancellationToken = default
    );

    Task<IPaginate<Colonist>> GetListAsync(
        Expression<Func<Colonist, bool>>? predicate = null,
        Func<IQueryable<Colonist>, IOrderedQueryable<Colonist>>? orderBy = null,
        int index = 0,
        int size = 10,
        CancellationToken cancellationToken = default
    );

    Task<Colonist> AddAsync(Colonist colonist);
    Task<Colonist> UpdateAsync(Colonist colonist);
    Task<Colonist> DeleteAsync(Colonist colonist, bool permanent = false);
}
