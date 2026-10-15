using Core.Persistence.Repositories;
using Domain.Entities;

namespace Application.Services.Repositories;

public interface IColonistRepository
    : IAsyncRepository<Colonist, int>,
        IRepository<Colonist, int> { }
