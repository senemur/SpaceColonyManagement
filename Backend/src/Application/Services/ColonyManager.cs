namespace Application.Services;

using Domain.Entities;

public class ColonyManager : IColonyService
{
    // Persistence aşamasında DbContext veya Repository injection ekleyeceğiz.
    public Task<Colony?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<List<Colony>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<Colony> AddAsync(Colony colony, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<Colony> UpdateAsync(Colony colony, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<Colony> DeleteAsync(Colony colony, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}
