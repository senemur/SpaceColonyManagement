namespace Application.Features.Colonies.Commands.Create;

public class CreatedColonyResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Commander { get; set; } = null!;
    public string Planet { get; set; } = null!;
    public string Location { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}
