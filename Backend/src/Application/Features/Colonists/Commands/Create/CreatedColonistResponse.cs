namespace Application.Features.Colonists.Commands.Create;

using Domain.Enums;

public class CreatedColonistResponse
{
    public int Id { get; set; }
    public int ColonyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public ColonistRole Role { get; set; }
    public int Health { get; set; }
    public int Morale { get; set; }
    public int? BuildingId { get; set; }
}
