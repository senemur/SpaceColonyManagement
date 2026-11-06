namespace Application.Features.Research.Rules;

using Application.Features.Research.Constants;
using Application.Services.Repositories;
using Core.Application.Rules;
using Core.CrossCuttingConcerns.Exception.Types;
using Domain.Entities;
using Domain.Enums;

public class ResearchBusinessRules(ITechnologyRepository technologyRepository) : BaseBusinessRules
{
    public Task TechnologyShouldExistWhenRequested(Technology? technology)
    {
        if (technology == null)
            throw new BusinessException(ResearchMessages.TechnologyNotFound);
        return Task.CompletedTask;
    }

    public Task ColonyShouldExistWhenRequested(Colony? colony)
    {
        if (colony == null)
            throw new BusinessException(ResearchMessages.ColonyNotFound);
        return Task.CompletedTask;
    }

    public Task TechnologyCannotBeStartedIfAlreadyCompleted(Technology technology)
    {
        if (technology.Status == ResearchStatus.Completed)
            throw new BusinessException(ResearchMessages.TechnologyAlreadyCompleted);
        return Task.CompletedTask;
    }

    public Task TechnologyCannotBeStartedIfAlreadyInProgress(Technology technology)
    {
        if (technology.Status == ResearchStatus.InProgress)
            throw new BusinessException(ResearchMessages.TechnologyAlreadyInProgress);
        return Task.CompletedTask;
    }

    public async Task OnlyOneResearchCanBeActiveAtATime(
        int colonyId,
        int technologyId,
        CancellationToken cancellationToken = default
    )
    {
        bool anotherInProgress = await technologyRepository.AnyAsync(
            predicate: t => t.ColonyId == colonyId && t.Id != technologyId && t.Status == ResearchStatus.InProgress,
            cancellationToken: cancellationToken
        );

        if (anotherInProgress)
            throw new BusinessException(ResearchMessages.AnotherResearchAlreadyInProgress);
    }

    public async Task PrerequisiteTechnologyMustBeCompleted(
        Technology technology,
        int colonyId,
        CancellationToken cancellationToken = default
    )
    {
        if (string.IsNullOrWhiteSpace(technology.PrerequisiteCode))
            return;

        Technology? prerequisite = await technologyRepository.GetAsync(
            predicate: t => t.ColonyId == colonyId && t.Code == technology.PrerequisiteCode,
            cancellationToken: cancellationToken
        );

        if (prerequisite == null || prerequisite.Status != ResearchStatus.Completed)
        {
            string prereqName = prerequisite?.Name ?? technology.PrerequisiteCode;
            throw new BusinessException(string.Format(ResearchMessages.PrerequisiteNotCompleted, prereqName));
        }
    }

    public Task ColonyMustHaveSufficientResources(Colony colony, Technology technology)
    {
        if (colony.Stats.Minerals < technology.MineralCost)
        {
            throw new BusinessException(string.Format(
                ResearchMessages.InsufficientMinerals,
                technology.MineralCost,
                colony.Stats.Minerals
            ));
        }

        if (colony.Stats.Credits < technology.CreditCost)
        {
            throw new BusinessException(string.Format(
                ResearchMessages.InsufficientCredits,
                technology.CreditCost,
                colony.Stats.Credits
            ));
        }

        return Task.CompletedTask;
    }
}
