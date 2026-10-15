using Application.Features.Buildings.Commands.Create;
using Application.Features.Buildings.Commands.ToggleStatus;
using Application.Features.Buildings.Commands.Upgrade;
using Application.Features.Buildings.Queries.GetListByColonyId;
using AutoMapper;
using Core.Application.Responses;
using Core.Persistence.Paging;
using Domain.Entities;

namespace Application.Features.Buildings.Profiles;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CreateBuildingCommand, Building>();
        CreateMap<Building, CreatedBuildingResponse>();

        CreateMap<Building, UpgradedBuildingResponse>();

        CreateMap<Building, GetListByColonyIdBuildingListItemDto>();
        CreateMap<IPaginate<Building>, GetListResponse<GetListByColonyIdBuildingListItemDto>>();

        CreateMap<Building, ToggleBuildingStatusResponse>();
    }
}
