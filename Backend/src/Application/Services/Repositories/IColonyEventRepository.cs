using Core.Persistence.Repositories;
using Domain.Entities;

namespace Application.Services.Repositories;

public interface IColonyEventRepository
    : IAsyncRepository<ColonyEvent, int>,
        IRepository<ColonyEvent, int> { }
