namespace Application.Features.Colonies.Commands.NextSol;

public class NextSolResponse
{
    public int Sol { get; set; }
    public decimal PowerProduced { get; set; }
    public decimal PowerConsumed { get; set; }
    public decimal WaterProduced { get; set; }
    public decimal WaterConsumed { get; set; }
    public decimal FoodProduced { get; set; }
    public decimal FoodConsumed { get; set; }
    public decimal MineralsProduced { get; set; }
    public int ActiveColonists { get; set; }
    public int WorkingColonists { get; set; }
    public int IdleColonists { get; set; }
    public List<string> LogMessages { get; set; } = [];
}