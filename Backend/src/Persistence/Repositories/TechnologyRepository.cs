namespace Persistence.Repositories;

using Application.Services.Repositories;
using Core.Persistence.Repositories;
using Domain.Entities;
using Persistence.Contexts;

public class TechnologyRepository(BaseDbContext context)
    : EfRepositoryBase<Technology, int, BaseDbContext>(context),
        ITechnologyRepository { }
