namespace Persistence.Repositories;

using Application.Services.Repositories;
using Core.Persistence.Repositories;
using Domain.Entities;
using Persistence.Contexts;

public class ColonyEventRepository(BaseDbContext context)
    : EfRepositoryBase<ColonyEvent, int, BaseDbContext>(context),
        IColonyEventRepository { }
