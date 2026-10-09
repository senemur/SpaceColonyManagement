namespace Application.Services;

using Domain.Entities;

public interface IColonyRepository
{
    Task<Colony?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<List<Colony>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Colony> AddAsync(Colony colony, CancellationToken cancellationToken = default);
    Task UpdateAsync(Colony colony, CancellationToken cancellationToken = default);
    Task DeleteAsync(Colony colony, CancellationToken cancellationToken = default);
}
