namespace Domain.ValueObjects;

// Zamanla dinamik olarak değişen sayısal kaynaklar ve oyun istatistiklerini temsil eden bir sınıf. Bu sınıf, koloninin mevcut durumu hakkında bilgi sağlar ve oyun mekaniği için temel bir yapı taşını oluşturur.

public class ColonyStats
{
    public int Sol { get; set; } =1;
    public int Population { get; set; } = 10;
    public int MaxPopulation { get; set; } = 25;

    public decimal Power { get; set; } = 100;
    public decimal MaxPower { get; set; } =250;

    public decimal Water { get; set; } = 80;
    public decimal MaxWater { get; set; } = 100;

    public decimal Oxygen { get; set; } = 90;
    public decimal MaxOxygen { get; set; } = 100;

    public decimal Food { get; set; } = 300;
    public decimal MaxFood { get; set; } = 500;

    public decimal Minerals { get; set; } = 1000;
    public decimal Credits { get; set; } = 25000;

    public int SafetyScore { get; set; } = 100;

    public ColonyStats()
    {
    }

    public ColonyStats(
        int sol = 1,
        int population = 10,
        int maxPopulation = 25,
        decimal power = 100,
        decimal maxPower = 250,
        decimal oxygen = 90,
        decimal maxOxygen = 100,
        decimal water = 80,
        decimal maxWater = 100,
        decimal food = 300,
        decimal maxFood = 500,
        decimal minerals = 1000,
        decimal credits = 25000,
        int safetyScore = 100)
    {
        Sol = sol;
        Population = population;
        MaxPopulation = maxPopulation;
        Power = power;
        MaxPower = maxPower;
        Oxygen = oxygen;
        MaxOxygen = maxOxygen;
        Water = water;
        MaxWater = maxWater;
        Food = food;
        MaxFood = maxFood;
        Minerals = minerals;
        Credits = credits;
        SafetyScore = safetyScore;
    }
}
