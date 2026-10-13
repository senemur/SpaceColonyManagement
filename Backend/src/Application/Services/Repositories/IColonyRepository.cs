namespace Application.Services.Repositories;

using Core.Persistence.Repositories;
using Domain.Entities;

public interface IColonyRepository : IAsyncRepository<Colony, int>, IRepository<Colony, int> { }
