namespace Application.Features.Research.Commands.StartResearch;

using Application.Features.Research.Rules;
using Application.Services.Repositories;
using Domain.Entities;
using Domain.Enums;
using MediatR;

public class StartResearchCommand : IRequest<StartResearchResponse>
{
    public int ColonyId { get; set; } = 1;
    public int TechnologyId { get; set; }

    public class StartResearchCommandHandler(
        ITechnologyRepository technologyRepository,
        IColonyRepository colonyRepository,
        ResearchBusinessRules researchBusinessRules
    ) : IRequestHandler<StartResearchCommand, StartResearchResponse>
    {
        public async Task<StartResearchResponse> Handle(
            StartResearchCommand request,
            CancellationToken cancellationToken
        )
        {
            Colony? colony = await colonyRepository.GetAsync(
                predicate: c => c.Id == request.ColonyId,
                cancellationToken: cancellationToken
            );
            await researchBusinessRules.ColonyShouldExistWhenRequested(colony);

            Technology? technology = await technologyRepository.GetAsync(
                predicate: t => t.Id == request.TechnologyId && t.ColonyId == request.ColonyId,
                cancellationToken: cancellationToken
            );
            await researchBusinessRules.TechnologyShouldExistWhenRequested(technology);

            await researchBusinessRules.TechnologyCannotBeStartedIfAlreadyCompleted(technology!);
            await researchBusinessRules.TechnologyCannotBeStartedIfAlreadyInProgress(technology!);
            await researchBusinessRules.OnlyOneResearchCanBeActiveAtATime(
                request.ColonyId,
                request.TechnologyId,
                cancellationToken
            );
            await researchBusinessRules.PrerequisiteTechnologyMustBeCompleted(
                technology!,
                request.ColonyId,
                cancellationToken
            );
            await researchBusinessRules.ColonyMustHaveSufficientResources(colony!, technology!);

            // Kaynak maliyetini düş
            colony!.Stats.Minerals -= technology!.MineralCost;
            colony.Stats.Credits -= technology.CreditCost;
            await colonyRepository.UpdateAsync(colony);

            // Araştırma durumunu güncelle
            technology.Status = ResearchStatus.InProgress;
            await technologyRepository.UpdateAsync(technology);

            return new StartResearchResponse
            {
                TechnologyId = technology.Id,
                Code = technology.Code,
                Name = technology.Name,
                Status = technology.Status,
                StatusName = "Araştırılıyor",
                Progress = technology.Progress,
                DurationInSols = technology.DurationInSols,
                RemainingMinerals = colony.Stats.Minerals,
                RemainingCredits = colony.Stats.Credits,
                Message = $"'{technology.Name}' araştırması başlatıldı. Tamamlanması için {technology.DurationInSols} Sol gerekiyor."
            };
        }
    }
}
