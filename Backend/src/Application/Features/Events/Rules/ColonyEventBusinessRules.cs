namespace Application.Features.Events.Rules;

using Application.Services.Repositories;
using Core.Application.Rules;
using Core.CrossCuttingConcerns.Exception.Types;
using Domain.Entities;

public class ColonyEventBusinessRules(IColonyEventRepository colonyEventRepository) : BaseBusinessRules
{
    public Task ColonyEventShouldExistWhenSelected(ColonyEvent? colonyEvent)
    {
        if (colonyEvent == null)
            throw new BusinessException("Olay kaydı bulunamadı.");
        return Task.CompletedTask;
    }

    public async Task ColonyEventShouldExist(int id, CancellationToken cancellationToken = default)
    {
        bool doesExists = await colonyEventRepository.AnyAsync(
            predicate: e => e.Id == id,
            cancellationToken: cancellationToken
        );
        if (!doesExists)
            throw new BusinessException("Olay kaydı bulunamadı.");
    }
}
