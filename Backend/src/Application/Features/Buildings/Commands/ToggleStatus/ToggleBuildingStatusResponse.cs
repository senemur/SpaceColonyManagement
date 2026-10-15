namespace Application.Features.Buildings.Commands.ToggleStatus;

public class ToggleBuildingStatusResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
