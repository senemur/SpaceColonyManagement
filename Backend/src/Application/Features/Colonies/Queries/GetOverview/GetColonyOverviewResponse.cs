namespace Application.FeaturesColonies.Queries.GetOverview;

using Domain.ValueObjects;

public class GetColonyOverviewResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Commander { get; set; } = null!;
    public string Planet { get; set; } = null!;
    public string Location { get; set; } = null!;
    public ColonyStats Stats { get; set; } = new ColonyStats();
}
