using Entities.Colonies;

namespace Business.Abstract
{
    public interface IColonyService
    {
        Task<Colony> CreateColonyAsync(int userId, string colonyName);
    }
}
