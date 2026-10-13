namespace Application.Features.Buildings.Constants;

public static class BuildingsMessages
{
    public const string BuildingNotExists = "Bina bulunamadı.";
    public const string ColonyNotExists = "Bina inşa edilmek istenen koloni bulunamadı.";
    public const string BuildingNameAlreadyExistsInColony =
        "Bu kolonide aynı isimde bir bina zaten mevcut.";
    public const string BuildingMaxLevelReached =
        "Bina zaten maksimum geliştirme seviyesine ulaştı (Seviye 5).";
    public const string BuildingNotActive = "Hasarlı veya devre dışı binalar yükseltilemez.";
}
