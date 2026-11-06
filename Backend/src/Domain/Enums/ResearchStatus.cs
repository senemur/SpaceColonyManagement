namespace Domain.Enums;

public enum ResearchStatus
{
    Locked = 1,     // Kilitli (Ön koşul henüz sağlanmadı)
    Available = 2,  // Başlatılabilir (Ön koşul tamamlandı, maliyet ödenebilir)
    InProgress = 3, // Araştırılıyor (Her Sol ilerleme kaydediliyor)
    Completed = 4   // Tamamlandı (Bonuslar aktif)
}
