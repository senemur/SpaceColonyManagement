namespace Persistence.Repositories;

using Application.Services.Repositories;
using Core.Persistence.Repositories;
using Domain.Entities;
using Persistence.Contexts;

public class ColonyRepository(BaseDbContext context)
    : EfRepositoryBase<Colony, int, BaseDbContext>(context),
        IColonyRepository { }
