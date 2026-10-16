namespace Application.Features.Colonists.Constants;

public static class ColonistsMessages
{
    public const string ColonistNotFound = "Kolonist bulunamadı.";
    public const string BuildingNotFound = "Atanmak istenen bina bulunamadı.";
    public const string BuildingIsNotActive = "Devre dışı veya hasarlı binalara personel atanamaz.";
    public const string BuildingCapacityFull = "Binanın çalışan kapasitesi dolu.";
    public const string ColonistHealthTooLow =
        "Ağır yaralı veya hasta personel (Sağlık <%20) çalışmaya atanamaz.";
    public const string ColonistNameAlreadyExistsInColony =
        "Bu kolonide aynı isimde bir kolonist zaten mevcut.";

    public const string ColonistStaminaTooLow =
        "Aşırı bitkin personel (Dayanıklılık <%15) dinlenmeden çalışmaya atanamaz.";
}
