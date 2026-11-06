namespace Application.Features.Research.Queries.GetTechTree;

using Application.Features.Research.Constants;
using Application.Features.Research.Rules;
using Application.Services.Repositories;
using Domain.Entities;
using Domain.Enums;
using MediatR;

public class GetTechTreeQuery : IRequest<List<TechnologyDto>>
{
    public int ColonyId { get; set; } = 1;

    public class GetTechTreeQueryHandler(
        ITechnologyRepository technologyRepository,
        IColonyRepository colonyRepository,
        ResearchBusinessRules researchBusinessRules
    ) : IRequestHandler<GetTechTreeQuery, List<TechnologyDto>>
    {
        public async Task<List<TechnologyDto>> Handle(
            GetTechTreeQuery request,
            CancellationToken cancellationToken
        )
        {
            Colony? colony = await colonyRepository.GetAsync(
                predicate: c => c.Id == request.ColonyId,
                cancellationToken: cancellationToken
            );
            await researchBusinessRules.ColonyShouldExistWhenRequested(colony);

            var result = await technologyRepository.GetListAsync(
                predicate: t => t.ColonyId == request.ColonyId,
                size: 50,
                cancellationToken: cancellationToken
            );

            List<Technology> techs = result.Items.ToList();

            // Eğer koloni için henüz teknoloji ağacı oluşturulmamışsa başlangıç ağacını tohumla
            if (!techs.Any())
            {
                var seedList = ResearchTreeSeedData.GetInitialTechnologiesForColony(request.ColonyId);
                foreach (var tech in seedList)
                {
                    await technologyRepository.AddAsync(tech);
                }

                techs = (await technologyRepository.GetListAsync(
                    predicate: t => t.ColonyId == request.ColonyId,
                    size: 50,
                    cancellationToken: cancellationToken
                )).Items.ToList();
            }

            // Kilit durumlarını dinamik kontrol et (Ön koşulu tamamlananları Available yap)
            var completedCodes = techs
                .Where(t => t.Status == ResearchStatus.Completed)
                .Select(t => t.Code)
                .ToHashSet();

            foreach (var tech in techs)
            {
                if (tech.Status == ResearchStatus.Locked && !string.IsNullOrEmpty(tech.PrerequisiteCode))
                {
                    if (completedCodes.Contains(tech.PrerequisiteCode))
                    {
                        tech.Status = ResearchStatus.Available;
                        await technologyRepository.UpdateAsync(tech);
                    }
                }
            }

            return techs
                .OrderBy(t => (int)t.Category)
                .ThenBy(t => t.DurationInSols)
                .Select(t => TechnologyDto.FromEntity(t, techs))
                .ToList();
        }
    }
}
