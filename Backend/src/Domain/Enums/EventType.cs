namespace Domain.Enums;

public enum EventType
{
    Info = 1,     // Bilgilendirme / Günlük Rapor
    Success = 2,  // Olumlu / Fırsat (Kaynak buluşu, mekiğin gelişi vb.)
    Warning = 3,  // Uyarı / Tehlike (Toz fırtınası, verim düşüşü)
    Critical = 4  // Kritik / Hasar (Şebeke çökmesi, salgın, kaza)
}
