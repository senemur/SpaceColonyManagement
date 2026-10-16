namespace Application.Features.Colonists.Queries.GetListByColonyId;

using Domain.Enums;

public class GetListByColonyIdColonistListItemDto
{
    public int Id { get; set; }
    public int ColonyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public ColonistRole Role { get; set; }
    public int Health { get; set; }
    public int Morale { get; set; }
    public int Stamina { get; set; }
    public int? BuildingId { get; set; }
    public string? BuildingName { get; set; }
    public bool IsAssigned { get; set; }
}
