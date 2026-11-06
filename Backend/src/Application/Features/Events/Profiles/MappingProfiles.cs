namespace Application.Features.Events.Profiles;

using Application.Features.Events.Queries.GetEventsByColonyId;
using AutoMapper;
using Domain.Entities;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<ColonyEvent, ColonyEventDto>();
    }
}
