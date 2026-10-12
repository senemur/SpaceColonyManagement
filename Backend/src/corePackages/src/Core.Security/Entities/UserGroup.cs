using Core.Persistence.Repositories;

namespace Core.Security.Entities;

public class UserGroup<TId> : Entity<TId>
{
    public string Name { get; set; }

    public UserGroup()
    {
        Name = string.Empty;
    }

    public UserGroup(string name)
    {
        Name = name;
    }

    public UserGroup(TId id, string name)
        : base(id)
    {
        Name = name;
    }
}
