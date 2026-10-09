namespace Application.Features.Colonies.Rules;

using Application.Features.Colonies.Constants;
using Domain.Entities;

public class ColonyBusinessRules
{
    public Task ColonyShouldExistWhenRequested(Colony? colony)
    {
        if (colony == null)
            throw new Exception(ColoniesMessages.ColonyNotFound);
        return Task.CompletedTask;
    }

    public void CheckIfColonyNameIsUnique(string colonyName, IEnumerable<Colony> existingColonies)
    {
        if (
            existingColonies.Any(c => c.Name.Equals(colonyName, StringComparison.OrdinalIgnoreCase))
        )
            throw new Exception(ColoniesMessages.ColonyAlreadyExists);
    }
}
