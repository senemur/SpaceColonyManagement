namespace Application.Features.Colonists.Profiles;

using Application.Features.Colonists.Commands.AssignToBuilding;
using Application.Features.Colonists.Commands.Create;
using Application.Features.Colonists.Queries.GetListByColonyId;
using AutoMapper;
using Core.Application.Responses;
using Core.Persistence.Paging;
using Domain.Entities;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CreateColonistCommand, Colonist>();
        CreateMap<Colonist, CreatedColonistResponse>();

        CreateMap<Colonist, AssignedColonistToBuildingResponse>();

        CreateMap<Colonist, GetListByColonyIdColonistListItemDto>()
            .ForMember(
                dest => dest.BuildingName,
                opt => opt.MapFrom(src => src.Building != null ? src.Building.Name : null)
            );

        CreateMap<IPaginate<Colonist>, GetListResponse<GetListByColonyIdColonistListItemDto>>();
    }
}
