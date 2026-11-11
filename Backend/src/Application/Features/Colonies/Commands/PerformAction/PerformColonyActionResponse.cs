namespace Application.Features.Colonies.Commands.PerformAction;

using Domain.ValueObjects;

public class PerformColonyActionResponse
{
    public bool Success { get; set; } = true;
    public string Message { get; set; } = string.Empty;
    public string ActionType { get; set; } = string.Empty;
    public decimal ResourceGained { get; set; }
    public string ResourceType { get; set; } = string.Empty;
    public ColonyStats Stats { get; set; } = new();
}
