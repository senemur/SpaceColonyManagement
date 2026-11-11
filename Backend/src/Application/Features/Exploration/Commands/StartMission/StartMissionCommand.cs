namespace Application.Features.Exploration.Commands.StartMission;

using Application.Features.Colonies.Rules;
using Application.Features.Exploration.Queries.GetMissionsByColonyId;
using Application.Features.Exploration.Rules;
using Application.Services.Repositories;
using Domain.Enums;
using MediatR;

public class StartMissionCommand : IRequest<ExplorationMissionDto>
{
    public int ColonyId { get; set; } = 1;
    public int MissionId { get; set; }

    public class StartMissionCommandHandler(
        IExplorationMissionRepository explorationMissionRepository,
        IColonyRepository colonyRepository,
        ExplorationMissionBusinessRules explorationMissionBusinessRules,
        ColonyBusinessRules colonyBusinessRules
    ) : IRequestHandler<StartMissionCommand, ExplorationMissionDto>
    {
        public async Task<ExplorationMissionDto> Handle(
            StartMissionCommand request,
            CancellationToken cancellationToken
        )
        {
            var colony = await colonyRepository.GetAsync(
                predicate: c => c.Id == request.ColonyId,
                cancellationToken: cancellationToken
            );
            await colonyBusinessRules.ColonyShouldExistWhenRequested(colony);

            var mission = await explorationMissionRepository.GetAsync(
                predicate: m => m.Id == request.MissionId && m.ColonyId == request.ColonyId,
                cancellationToken: cancellationToken
            );
            await explorationMissionBusinessRules.MissionShouldExist(mission);
            await explorationMissionBusinessRules.MissionShouldBeAvailableToStart(mission!);
            await explorationMissionBusinessRules.ColonyShouldHaveSufficientResources(colony!, mission!);

            // Kaynak maliyetlerini düş
            var stats = colony!.Stats;
            stats.Power = Math.Max(0, stats.Power - mission!.EnergyCost);
            stats.Water = Math.Max(0, stats.Water - mission.WaterCost);
            stats.Credits = Math.Max(0, stats.Credits - mission.CreditsCost);

            // Görevi başlat
            mission.Status = MissionStatus.InProgress;
            mission.RemainingSols = mission.DurationInSols;
            mission.StartSol = stats.Sol;
            mission.ResultSummary = $"Keşif ekibi {mission.TargetZone} bölgesine hareket etti. Tahmini dönüş: Sol {stats.Sol + mission.DurationInSols}.";

            await colonyRepository.UpdateAsync(colony);
            await explorationMissionRepository.UpdateAsync(mission);

            return ExplorationMissionDto.FromEntity(mission);
        }
    }
}
