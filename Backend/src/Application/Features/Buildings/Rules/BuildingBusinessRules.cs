using Application.Features.Buildings.Constants;
using Application.Services.Repositories;
using Core.Application.Responses;
using Core.Application.Rules;
using Core.CrossCuttingConcerns.Exception.Types;
using Domain.Entities;

namespace Application.Features.Buildings.Rules;

public class BuildingBusinessRules(
    IBuildingRepository buildingRepository,
    IColonyRepository colonyRepository
) : BaseBusinessRules
{
    public async Task ColonyShouldExistWhenSelected(
        int colonyId,
        CancellationToken cancellationToken
    )
    {
        bool doesExist = await colonyRepository.AnyAsync(
            predicate: c => c.Id == colonyId,
            cancellationToken: cancellationToken
        );

        if (!doesExist)
            throw new BusinessException(BuildingsMessages.ColonyNotExists);
    }

    public Task BuildingShouldExistWhenSelected(Building? building)
    {
        if (building == null)
            throw new BusinessException(BuildingsMessages.BuildingNotExists);
        return Task.CompletedTask;
    }

    public async Task BuildingNameCannotBeDuplicatedInSameColony(
        int colonyId,
        string name,
        CancellationToken cancellationToken
    )
    {
        bool doesExist = await buildingRepository.AnyAsync(
            predicate: b => b.ColonyId == colonyId && b.Name.ToLower() == name.ToLower(),
            cancellationToken: cancellationToken
        );

        if (doesExist)
            throw new BusinessException(BuildingsMessages.BuildingNameAlreadyExistsInColony);
    }

    public Task BuildingLevelCannotExceedMaxLimit(int currentLevel)
    {
        const int maxLevel = 5;
        if (currentLevel >= maxLevel)
            throw new BusinessException(BuildingsMessages.BuildingMaxLevelReached);
        return Task.CompletedTask;
    }

    public Task BuildingMustBeActiveToUpgrade(bool isActive)
    {
        if (!isActive)
            throw new BusinessException(BuildingsMessages.BuildingNotActive);
        return Task.CompletedTask;
    }
}
