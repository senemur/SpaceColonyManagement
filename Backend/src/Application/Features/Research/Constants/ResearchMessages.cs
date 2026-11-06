namespace Application.Features.Research.Constants;

public static class ResearchMessages
{
    public const string TechnologyNotFound = "Araştırma teknolojisi bulunamadı.";
    public const string ColonyNotFound = "Belirtilen koloni bulunamadı.";
    public const string TechnologyAlreadyCompleted = "Bu teknoloji zaten tamamlanmış.";
    public const string TechnologyAlreadyInProgress = "Bu teknoloji şu anda zaten araştırılıyor.";
    public const string AnotherResearchAlreadyInProgress = "Aynı anda yalnızca bir teknoloji araştırılabilir. Lütfen mevcut araştırmanın tamamlanmasını bekleyin.";
    public const string PrerequisiteNotCompleted = "Ön koşul teknoloji ({0}) henüz tamamlanmadığı için bu araştırmayı başlatamazsınız.";
    public const string InsufficientMinerals = "Yetersiz maden rezervi. Gereken: {0}, Mevcut: {1}.";
    public const string InsufficientCredits = "Yetersiz kredi bakiyesi. Gereken: {0}, Mevcut: {1}.";
}
