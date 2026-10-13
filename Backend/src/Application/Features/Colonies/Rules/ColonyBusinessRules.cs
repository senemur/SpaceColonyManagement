namespace Application.Features.Colonies.Rules;

using Application.Features.Colonies.Constants;
using Application.Services.Repositories;
using Core.Application.Rules;
using Core.CrossCuttingConcerns.Exception.Types;
using Domain.Entities;

public class ColonyBusinessRules(IColonyRepository colonyRepository) : BaseBusinessRules
{
    public Task ColonyShouldExistWhenRequested(Colony? colony)
    {
        if (colony == null)
            throw new BusinessException(ColoniesMessages.ColonyNotFound);
        return Task.CompletedTask;
    }

    public async Task ColonyNameCannotBeDuplicatedWhenInserted(
        string name,
        CancellationToken cancellationToken = default
    )
    {
        bool doesExists = await colonyRepository.AnyAsync(
            predicate: c => c.Name.ToLower() == name.ToLower(),
            cancellationToken: cancellationToken
        );
        if (doesExists)
            throw new BusinessException(ColoniesMessages.ColonyAlreadyExists);
    }
}
