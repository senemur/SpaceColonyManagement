namespace Application.Features.Colonies.Commands.PerformAction;

using Application.Features.Colonies.Rules;
using Application.Services.Repositories;
using Domain.Entities;
using Domain.Enums;
using MediatR;

public class PerformColonyActionCommand : IRequest<PerformColonyActionResponse>
{
    public int ColonyId { get; set; } = 1;
    public string ActionType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int? BuildingId { get; set; }
    public string? Description { get; set; }

    public class PerformColonyActionCommandHandler(
        IColonyRepository colonyRepository,
        IBuildingRepository buildingRepository,
        ITechnologyRepository technologyRepository,
        IColonyEventRepository colonyEventRepository,
        ColonyBusinessRules colonyBusinessRules
    ) : IRequestHandler<PerformColonyActionCommand, PerformColonyActionResponse>
    {
        public async Task<PerformColonyActionResponse> Handle(
            PerformColonyActionCommand request,
            CancellationToken cancellationToken
        )
        {
            var colony = await colonyRepository.GetAsync(
                predicate: c => c.Id == request.ColonyId,
                cancellationToken: cancellationToken
            );
            await colonyBusinessRules.ColonyShouldExistWhenRequested(colony);

            var stats = colony!.Stats;
            var response = new PerformColonyActionResponse
            {
                ActionType = request.ActionType
            };

            switch (request.ActionType.ToLowerInvariant())
            {
                case "harvestfood":
                case "harvest":
                case "sera":
                case "farm":
                    decimal foodAmount = request.Amount > 0 ? request.Amount : 45m;
                    stats.Food = Math.Clamp(stats.Food + foodAmount, 0, stats.MaxFood);
                    response.ResourceType = "Food";
                    response.ResourceGained = foodAmount;
                    response.Message = $"Sera hasadı başarıyla tamamlandı! +{foodAmount:0} kg besin depolara aktarıldı.";

                    var farmEvent = new ColonyEvent(
                        colonyId: request.ColonyId,
                        sol: stats.Sol,
                        title: "Sera Hasadı Yapıldı",
                        message: $"Hidroponik seradaki mahsuller toplandı. +{foodAmount:0} kg besin koloni stoklarına eklendi.",
                        type: EventType.Success
                    );
                    await colonyEventRepository.AddAsync(farmEvent);
                    break;

                case "extractwater":
                case "water":
                case "su":
                    decimal waterAmount = request.Amount > 0 ? request.Amount : 50m;
                    stats.Water = Math.Clamp(stats.Water + waterAmount, 0, stats.MaxWater);
                    response.ResourceType = "Water";
                    response.ResourceGained = waterAmount;
                    response.Message = $"Su çıkarma/tank dolumu tamamlandı! +{waterAmount:0} L su depolandı.";

                    var waterEvent = new ColonyEvent(
                        colonyId: request.ColonyId,
                        sol: stats.Sol,
                        title: "Su Rezervi Dolduruldu",
                        message: $"Su sondaj tesisinden +{waterAmount:0} L taze su çıkarıldı ve depolandı.",
                        type: EventType.Info
                    );
                    await colonyEventRepository.AddAsync(waterEvent);
                    break;

                case "mineore":
                case "mine":
                case "maden":
                    decimal mineralAmount = request.Amount > 0 ? request.Amount : 60m;
                    stats.Minerals += mineralAmount;
                    response.ResourceType = "Minerals";
                    response.ResourceGained = mineralAmount;
                    response.Message = $"Regolit madenciliği tamamlandı! +{mineralAmount:0} t cevher çıkarıldı.";

                    var mineEvent = new ColonyEvent(
                        colonyId: request.ColonyId,
                        sol: stats.Sol,
                        title: "Cevher Madenciliği",
                        message: $"Regolit ocağından +{mineralAmount:0} t metal ve mineral çıkarıldı.",
                        type: EventType.Info
                    );
                    await colonyEventRepository.AddAsync(mineEvent);
                    break;

                case "generatepower":
                case "power":
                case "solar":
                case "enerji":
                    decimal powerAmount = request.Amount > 0 ? request.Amount : 35m;
                    stats.Power = Math.Clamp(stats.Power + powerAmount, 0, stats.MaxPower);
                    response.ResourceType = "Power";
                    response.ResourceGained = powerAmount;
                    response.Message = $"Güneş dizisi temizlendi ve optimize edildi! +{powerAmount:0} kW güç sağlandı.";
                    break;

                case "researchprogress":
                case "lab":
                case "bilim":
                    decimal progressAmount = request.Amount > 0 ? request.Amount : 10m;
                    var activeTech = await technologyRepository.GetAsync(
                        predicate: t => t.ColonyId == request.ColonyId && t.Status == ResearchStatus.InProgress,
                        cancellationToken: cancellationToken
                    );

                    if (activeTech != null)
                    {
                        activeTech.Progress = Math.Min(100m, activeTech.Progress + progressAmount);
                        if (activeTech.Progress >= 100m)
                        {
                            activeTech.Status = ResearchStatus.Completed;
                            response.Message = $"BİLİMSEL BAŞARI: '{activeTech.Name}' araştırması tamamlandı!";

                            var techEvent = new ColonyEvent(
                                colonyId: request.ColonyId,
                                sol: stats.Sol,
                                title: $"Buluş Tamamlandı: {activeTech.Name}",
                                message: $"Laboratuvar personeli '{activeTech.Name}' araştırmasını tamamladı. +%{activeTech.BonusValue:0} {activeTech.BonusType} bonusu aktifleşti.",
                                type: EventType.Success
                            );
                            await colonyEventRepository.AddAsync(techEvent);

                            var unlockedTechsData = await technologyRepository.GetListAsync(
                                predicate: t => t.ColonyId == request.ColonyId && t.Status == ResearchStatus.Locked && t.PrerequisiteCode == activeTech.Code,
                                cancellationToken: cancellationToken
                            );
                            foreach (var u in unlockedTechsData.Items)
                            {
                                u.Status = ResearchStatus.Available;
                                await technologyRepository.UpdateAsync(u);
                            }
                        }
                        else
                        {
                            response.Message = $"Laboratuvar analizi: '{activeTech.Name}' +%{progressAmount:0} ilerledi (%{activeTech.Progress:0.0} tamamlandı).";
                        }
                        await technologyRepository.UpdateAsync(activeTech);
                    }
                    else
                    {
                        response.Message = "Laboratuvar kalibrasyonu tamamlandı. (Şu anda devam eden araştırma bulunmuyor)";
                    }
                    break;

                case "repairbuilding":
                case "repair":
                case "tamir":
                    if (request.BuildingId.HasValue)
                    {
                        var building = await buildingRepository.GetAsync(
                            predicate: b => b.Id == request.BuildingId.Value && b.ColonyId == request.ColonyId,
                            cancellationToken: cancellationToken
                        );
                        if (building != null)
                        {
                            building.Health = 100;
                            await buildingRepository.UpdateAsync(building);
                            response.Message = $"{building.Name} modülü onarıldı (%100 bütünlük).";
                        }
                    }
                    break;

                default:
                    response.Message = $"{request.ActionType} operasyonu başarıyla gerçekleştirildi.";
                    break;
            }

            colony.LastActiveDate = DateTime.UtcNow;
            await colonyRepository.UpdateAsync(colony);

            response.Stats = stats;
            return response;
        }
    }
}
