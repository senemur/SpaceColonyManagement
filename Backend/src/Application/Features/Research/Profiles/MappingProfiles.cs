namespace Application.Features.Research.Profiles;

using AutoMapper;
using Domain.Entities;
using Application.Features.Research.Queries.GetTechTree;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Technology, TechnologyDto>();
    }
}
