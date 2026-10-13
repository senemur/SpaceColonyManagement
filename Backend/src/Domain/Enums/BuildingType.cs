namespace Domain.Enums;

public enum BuildingType
{
    Habitat = 1, // Yaşam Kubbesi (Nüfus kapasitesi sağlar, oksijen/enerji tüketir)
    SolarPanel = 2, // Güneş Paneli Tarlası (Enerji üretir)
    Greenhouse = 3, // Hidroponik Sera (Besin üretir, su/enerji tüketir)
    Mine = 4, // Maden Kompleksi (Maden üretir, enerji tüketir)
    WaterExtractor = 5, // Yeraltı Buz/Su Çıkarma (Su üretir, enerji tüketir)
    ResearchLab = 6, // Araştırma Laboratuvarı (Teknoloji puanı üretir, enerji tüketir)
}
