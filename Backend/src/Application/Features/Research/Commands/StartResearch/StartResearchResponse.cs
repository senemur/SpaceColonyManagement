namespace Application.Features.Research.Commands.StartResearch;

using Domain.Enums;

public class StartResearchResponse
{
    public int TechnologyId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public ResearchStatus Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public decimal Progress { get; set; }
    public int DurationInSols { get; set; }
    public decimal RemainingMinerals { get; set; }
    public decimal RemainingCredits { get; set; }
    public string Message { get; set; } = string.Empty;
}
