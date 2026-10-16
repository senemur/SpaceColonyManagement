namespace Application.Features.Colonists.Rules;

using Application.Features.Colonists.Constants;
using Application.Services.Repositories;
using Core.Application.Rules;
using Core.CrossCuttingConcerns.Exception.Types;
using Domain.Entities;

public class ColonistBusinessRules(IColonistRepository colonistRepository) : BaseBusinessRules
{
    public Task ColonistShouldExistWhenSelected(Colonist? colonist)
    {
        if (colonist == null)
            throw new BusinessException(ColonistsMessages.ColonistNotFound);
        return Task.CompletedTask;
    }

    public Task BuildingShouldBeActiveToAssign(bool isActive)
    {
        if (!isActive)
            throw new BusinessException(ColonistsMessages.BuildingIsNotActive);
        return Task.CompletedTask;
    }

    public Task BuildingCapacityShouldNotBeExceeded(int currentWorkers, int maxWorkers)
    {
        if (currentWorkers >= maxWorkers)
            throw new BusinessException(ColonistsMessages.BuildingCapacityFull);
        return Task.CompletedTask;
    }

    public Task ColonistShouldBeHealthyEnoughToWork(int health)
    {
        if (health < 20)
            throw new BusinessException(ColonistsMessages.ColonistHealthTooLow);
        return Task.CompletedTask;
    }

    public async Task ColonistNameCannotBeDuplicatedInSameColony(
        int colonyId,
        string name,
        CancellationToken cancellationToken = default
    )
    {
        bool doesExist = await colonistRepository.AnyAsync(
            predicate: c => c.ColonyId == colonyId && c.Name.ToLower() == name.ToLower(),
            cancellationToken: cancellationToken
        );

        if (doesExist)
            throw new BusinessException(ColonistsMessages.ColonistNameAlreadyExistsInColony);
    }

    public Task ColonistShouldHaveEnoughStaminaToWork(int stamina)
    {
        if (stamina < 15)
            throw new BusinessException(ColonistsMessages.ColonistStaminaTooLow);
        return Task.CompletedTask;
    }
}
