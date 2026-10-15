namespace Persistence.Repositories;

using Application.Services.Repositories;
using Core.Persistence.Repositories;
using Domain.Entities;
using Persistence.Contexts;

public class ColonistRepository(BaseDbContext context)
    : EfRepositoryBase<Colonist, int, BaseDbContext>(context),
        IColonistRepository { }
