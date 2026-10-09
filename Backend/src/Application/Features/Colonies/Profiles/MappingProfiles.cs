namespace Application.Features.Colonies.Profiles;

using Application.Features.Colonies.Commands.Create;
using Application.Features.Colonies.Queries.GetOverview;
using AutoMapper;
using Domain.Entities;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CreateColonyCommand, Colony>();
        CreateMap<Colony, CreatedColonyResponse>();
        CreateMap<Colony, GetColonyOverviewResponse>();
    }
}
