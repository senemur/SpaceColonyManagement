namespace Application.Services;

using Domain.Entities;

public interface IColonyService
{
    Task<Colony?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<ICollection<Colony>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Colony> AddAsync(Colony colony, CancellationToken cancellationToken = default);
    Task<Colony> UpdateAsync(Colony colony, CancellationToken cancellationToken = default);
    Task<Colony> DeleteAsync(
        Colony colony,
        bool permanent = false,
        CancellationToken cancellationToken = default
    );
}
