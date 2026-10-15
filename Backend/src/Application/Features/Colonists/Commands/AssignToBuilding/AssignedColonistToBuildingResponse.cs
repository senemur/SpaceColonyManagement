namespace Application.Features.Colonists.Commands.AssignToBuilding;

public class AssignedColonistToBuildingResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int? BuildingId { get; set; }
    public bool IsAssigned { get; set; }
}
