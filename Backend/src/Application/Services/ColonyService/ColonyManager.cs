namespace Application.Services;

using Application.Services.Repositories;
using Domain.Entities;

public class ColonyManager(IColonyRepository colonyRepository) : IColonyService
{
    public async Task<Colony?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await colonyRepository.GetAsync(
            predicate: c => c.Id == id,
            cancellationToken: cancellationToken
        );
    }

    public async Task<ICollection<Colony>> GetAllAsync(
        CancellationToken cancellationToken = default
    )
    {
        return await colonyRepository.GetAllAsync(cancellationToken: cancellationToken);
    }

    public async Task<Colony> AddAsync(Colony colony, CancellationToken cancellationToken = default)
    {
        return await colonyRepository.AddAsync(colony, cancellationToken);
    }

    public async Task<Colony> UpdateAsync(
        Colony colony,
        CancellationToken cancellationToken = default
    )
    {
        return await colonyRepository.UpdateAsync(colony, cancellationToken);
    }

    public async Task<Colony> DeleteAsync(
        Colony colony,
        bool permanent = false,
        CancellationToken cancellationToken = default
    )
    {
        return await colonyRepository.DeleteAsync(
            colony,
            permanent: permanent,
            cancellationToken: cancellationToken
        );
    }
}
