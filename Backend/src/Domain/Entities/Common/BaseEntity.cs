namespace Domain.Entities.Common;

public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public BaseEntity()
    {
        Id = default;
    }

    public BaseEntity(int id)
    {
        Id = id;
    }
}