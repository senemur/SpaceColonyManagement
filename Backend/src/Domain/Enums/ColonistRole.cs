namespace Domain.Enums;

public enum ColonistRole
{
    Worker = 0,
    Commander = 1, // Kaptan / Yönetici
    Engineer = 2, // Mühendis (Güneş paneli, şebeke bakımı)
    Biologist = 3, // Biyolog / Tarımcı (Sera modülü)
    Miner = 4, // Madenci (Maden kompleksi)
    Doctor = 5, // Doktor (Sağlık ve moral)
    Technician = 6, // Teknisyen (Su arıtma, yaşam destek)
    Scientist = 7, // Bilim İnsanı (Laboratuvar)
    Civilian = 8, // Sivil / Yeni Yerleşimci (Henüz atanmamış yeni gelen)
}
