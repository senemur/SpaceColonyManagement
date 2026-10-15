using System.Linq.Expressions;
using Application.Services.Repositories;
using Core.Persistence.Paging;
using Domain.Entities;

namespace Application.Services.ColonistService;

public class ColonistManager(IColonistRepository colonistRepository) : IColonistService
{
    public async Task<Colonist> AddAsync(Colonist colonist)
    {
        return await colonistRepository.AddAsync(colonist);
    }

    public async Task<Colonist> DeleteAsync(Colonist colonist, bool permanent = false)
    {
        return await colonistRepository.UpdateAsync(colonist);
    }

    public async Task<Colonist?> GetAsync(
        Expression<Func<Colonist, bool>> predicate,
        CancellationToken cancellationToken = default
    )
    {
        return await colonistRepository.GetAsync(predicate, cancellationToken: cancellationToken);
    }

    public async Task<IPaginate<Colonist>> GetListAsync(
        Expression<Func<Colonist, bool>>? predicate = null,
        Func<IQueryable<Colonist>, IOrderedQueryable<Colonist>>? orderBy = null,
        int index = 0,
        int size = 10,
        CancellationToken cancellationToken = default
    )
    {
        return await colonistRepository.GetListAsync(
            predicate,
            orderBy,
            index: index,
            size: size,
            cancellationToken: cancellationToken
        );
    }

    public async Task<Colonist> UpdateAsync(Colonist colonist)
    {
        return await colonistRepository.UpdateAsync(colonist);
    }
}
