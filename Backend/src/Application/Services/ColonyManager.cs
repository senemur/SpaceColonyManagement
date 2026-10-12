namespace Application.Services;

namespace Application.Services;

using Application.Services.Repositories;
using Domain.Entities;

public class ColonyManager : IColonyService
{
    private readonly IColonyRepository _colonyRepository;

    public ColonyManager(IColonyRepository colonyRepository)
    {
        _colonyRepository = colonyRepository;
    }

    public async Task<Colony?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _colonyRepository.GetByIdAsync(id, cancellationToken);
    }

    public async Task<List<Colony>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _colonyRepository.GetAllAsync(cancellationToken);
    }

    public async Task<Colony> AddAsync(Colony colony, CancellationToken cancellationToken = default)
    {
        return await _colonyRepository.AddAsync(colony, cancellationToken);
    }

    public async Task<Colony> UpdateAsync(Colony colony, CancellationToken cancellationToken = default)
    {
        return await _colonyRepository.UpdateAsync(colony, cancellationToken);
    }

    public async Task<Colony> DeleteAsync(Colony colony, CancellationToken cancellationToken = default)
    {
        return await _colonyRepository.DeleteAsync(colony, cancellationToken);
    }
}