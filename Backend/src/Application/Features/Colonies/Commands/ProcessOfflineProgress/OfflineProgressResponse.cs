namespace Application.Features.Colonies.Commands.ProcessOfflineProgress;

public class OfflineProgressResponse
{
    public bool HasProgress { get; set; }
    public double ElapsedMinutes { get; set; }
    public int SolsAdvanced { get; set; }
    public decimal PowerChange { get; set; }
    public decimal WaterChange { get; set; }
    public decimal FoodChange { get; set; }
    public decimal OxygenChange { get; set; }
    public decimal MineralsChange { get; set; }
    public string SummaryMessage { get; set; } = string.Empty;
    public List<string> Details { get; set; } = new();
    public DateTime LastActiveDate { get; set; }
    public DateTime CurrentSyncDate { get; set; }
}
