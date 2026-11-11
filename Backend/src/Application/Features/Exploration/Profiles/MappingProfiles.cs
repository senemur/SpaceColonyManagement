namespace Application.Features.Exploration.Profiles;

using Application.Features.Exploration.Queries.GetMissionsByColonyId;
using AutoMapper;
using Domain.Entities;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<ExplorationMission, ExplorationMissionDto>().ReverseMap();
    }
}
