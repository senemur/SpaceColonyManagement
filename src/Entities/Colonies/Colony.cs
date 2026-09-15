using Entities.Colonists;
using Entities.Users;

namespace Entities.Colonies;

public class Colony
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Planet { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime LastActiveAt { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public ICollection<Colonist> Colonists { get; set; } = new List<Colonist>();
}
