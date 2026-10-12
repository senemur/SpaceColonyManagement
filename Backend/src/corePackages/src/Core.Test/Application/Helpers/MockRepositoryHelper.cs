using System.Linq.Expressions;
using Core.Persistence.Dynamic;
using Core.Persistence.Paging;
using Core.Persistence.Repositories;
using Microsoft.EntityFrameworkCore.Query;
using Moq;

namespace Core.Test.Application.Helpers;

public static class MockRepositoryHelper
{
    public static Mock<TRepository> GetRepository<TRepository, TEntity, TEntityId>(
        List<TEntity> list
    )
        where TEntity : Entity<TEntityId>, new()
        where TRepository : class,
            IAsyncRepository<TEntity, TEntityId>,
            IRepository<TEntity, TEntityId>
    {
        var mockRepo = new Mock<TRepository>();

        Build<TRepository, TEntity, TEntityId>(mockRepo, list);
        return mockRepo;
    }

    private static void Build<TRepository, TEntity, TEntityId>(
        Mock<TRepository> mockRepo,
        List<TEntity> entityList
    )
        where TEntity : Entity<TEntityId>, new()
        where TRepository : class,
            IAsyncRepository<TEntity, TEntityId>,
            IRepository<TEntity, TEntityId>
    {
        SetupGetAsync<TRepository, TEntity, TEntityId>(mockRepo, entityList);
        SetupGetAllAsync<TRepository, TEntity, TEntityId>(mockRepo, entityList);
        SetupGetListAsync<TRepository, TEntity, TEntityId>(mockRepo, entityList);
        SetupGetListByDynamicAsync<TRepository, TEntity, TEntityId>(mockRepo, entityList);
        SetupAnyAsync<TRepository, TEntity, TEntityId>(mockRepo, entityList);
        SetupCountAsync<TRepository, TEntity, TEntityId>(mockRepo, entityList);
        SetupAddAsync<TRepository, TEntity, TEntityId>(mockRepo, entityList);
        SetupAddRangeAsync<TRepository, TEntity, TEntityId>(mockRepo, entityList);
        SetupUpdateAsync<TRepository, TEntity, TEntityId>(mockRepo, entityList);
        SetupUpdateRangeAsync<TRepository, TEntity, TEntityId>(mockRepo, entityList);
        SetupDeleteAsync<TRepository, TEntity, TEntityId>(mockRepo, entityList);
        SetupDeleteRangeAsync<TRepository, TEntity, TEntityId>(mockRepo, entityList);
    }

    private static void SetupGetAsync<TRepository, TEntity, TEntityId>(
        Mock<TRepository> mockRepo,
        List<TEntity> entityList
    )
        where TEntity : Entity<TEntityId>, new()
        where TRepository : class,
            IAsyncRepository<TEntity, TEntityId>,
            IRepository<TEntity, TEntityId>
    {
        mockRepo
            .Setup(s =>
                s.GetAsync(
                    It.IsAny<Expression<Func<TEntity, bool>>>(),
                    It.IsAny<Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>>(),
                    It.IsAny<Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>>(),
                    It.IsAny<bool>(),
                    It.IsAny<bool>(),
                    It.IsAny<CancellationToken>()
                )
            )
            .ReturnsAsync(
                (
                    Expression<Func<TEntity, bool>> predicate,
                    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy,
                    Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include,
                    bool withDeleted,
                    bool enableTracking,
                    CancellationToken cancellationToken
                ) =>
                {
                    if (!withDeleted)
                        entityList = [.. entityList.Where(e => !e.DeletedDate.HasValue)];
                    TEntity? result = entityList.FirstOrDefault(predicate: predicate.Compile());
                    return result;
                }
            );
    }

    private static void SetupGetAllAsync<TRepository, TEntity, TEntityId>(
        Mock<TRepository> mockRepo,
        List<TEntity> entityList
    )
        where TEntity : Entity<TEntityId>, new()
        where TRepository : class,
            IAsyncRepository<TEntity, TEntityId>,
            IRepository<TEntity, TEntityId>
    {
        mockRepo
            .Setup(s =>
                s.GetAllAsync(
                    It.IsAny<Expression<Func<TEntity, bool>>>(),
                    It.IsAny<Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>>(),
                    It.IsAny<Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>>(),
                    It.IsAny<bool>(),
                    It.IsAny<bool>(),
                    It.IsAny<CancellationToken>()
                )
            )
            .ReturnsAsync(
                (
                    Expression<Func<TEntity, bool>> predicate,
                    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy,
                    Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include,
                    bool withDeleted,
                    bool enableTracking,
                    CancellationToken cancellationToken
                ) =>
                {
                    IList<TEntity> list = [];
                    if (!withDeleted)
                        list = [.. entityList.Where(e => !e.DeletedDate.HasValue)];
                    list =
                        predicate == null
                            ? entityList
                            : (IList<TEntity>)[.. entityList.Where(predicate.Compile())];
                    return list;
                }
            );
    }

    private static void SetupGetListAsync<TRepository, TEntity, TEntityId>(
        Mock<TRepository> mockRepo,
        List<TEntity> entityList
    )
        where TEntity : Entity<TEntityId>, new()
        where TRepository : class,
            IAsyncRepository<TEntity, TEntityId>,
            IRepository<TEntity, TEntityId>
    {
        mockRepo
            .Setup(s =>
                s.GetListAsync(
                    It.IsAny<Expression<Func<TEntity, bool>>>(),
                    It.IsAny<Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>>(),
                    It.IsAny<Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>>(),
                    It.IsAny<int>(),
                    It.IsAny<int>(),
                    It.IsAny<bool>(),
                    It.IsAny<bool>(),
                    It.IsAny<CancellationToken>()
                )
            )
            .ReturnsAsync(
                (
                    Expression<Func<TEntity, bool>> predicate,
                    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy,
                    Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include,
                    int index,
                    int size,
                    bool withDeleted,
                    bool enableTracking,
                    CancellationToken cancellationToken
                ) =>
                {
                    IList<TEntity> list = [];

                    if (!withDeleted)
                        list = [.. entityList.Where(e => !e.DeletedDate.HasValue)];
                    list =
                        predicate == null
                            ? entityList
                            : (IList<TEntity>)[.. entityList.Where(predicate.Compile())];

                    Paginate<TEntity> paginateList = new() { Items = list };
                    return paginateList;
                }
            );
    }

    private static void SetupGetListByDynamicAsync<TRepository, TEntity, TEntityId>(
        Mock<TRepository> mockRepo,
        List<TEntity> entityList
    )
        where TEntity : Entity<TEntityId>, new()
        where TRepository : class,
            IAsyncRepository<TEntity, TEntityId>,
            IRepository<TEntity, TEntityId>
    {
        mockRepo
            .Setup(s =>
                s.GetListByDynamicAsync(
                    It.IsAny<DynamicQuery>(),
                    It.IsAny<Expression<Func<TEntity, bool>>>(),
                    It.IsAny<Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>>(),
                    It.IsAny<Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>>(),
                    It.IsAny<int>(),
                    It.IsAny<int>(),
                    It.IsAny<bool>(),
                    It.IsAny<bool>(),
                    It.IsAny<CancellationToken>()
                )
            )
            .ReturnsAsync(
                (
                    DynamicQuery dynamic,
                    Expression<Func<TEntity, bool>> predicate,
                    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy,
                    Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include,
                    int index,
                    int size,
                    bool withDeleted,
                    bool enableTracking,
                    CancellationToken cancellationToken
                ) =>
                {
                    IList<TEntity> list = [];
                    if (!withDeleted)
                        list = [.. entityList.Where(e => !e.DeletedDate.HasValue)];
                    list =
                        predicate == null
                            ? entityList
                            : (IList<TEntity>)[.. entityList.Where(predicate.Compile())];
                    Paginate<TEntity> paginateList = new() { Items = list };
                    return paginateList;
                }
            );
    }

    public static void SetupAnyAsync<TRepository, TEntity, TEntityId>(
        Mock<TRepository> mockRepo,
        List<TEntity> entityList
    )
        where TEntity : Entity<TEntityId>, new()
        where TRepository : class,
            IAsyncRepository<TEntity, TEntityId>,
            IRepository<TEntity, TEntityId>
    {
        mockRepo
            .Setup(s =>
                s.AnyAsync(
                    It.IsAny<Expression<Func<TEntity, bool>>>(),
                    It.IsAny<Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>?>(),
                    It.IsAny<bool>(),
                    It.IsAny<bool>(),
                    It.IsAny<CancellationToken>()
                )
            )
            .ReturnsAsync(
                (
                    Expression<Func<TEntity, bool>> predicate,
                    Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include,
                    bool withDeleted,
                    bool enableTracking,
                    CancellationToken cancellationToken
                ) =>
                {
                    if (!withDeleted)
                        entityList = [.. entityList.Where(e => !e.DeletedDate.HasValue)];
                    return entityList.Any(predicate.Compile());
                }
            );
    }

    private static void SetupCountAsync<TRepository, TEntity, TEntityId>(
        Mock<TRepository> mockRepo,
        List<TEntity> entityList
    )
        where TEntity : Entity<TEntityId>, new()
        where TRepository : class,
            IAsyncRepository<TEntity, TEntityId>,
            IRepository<TEntity, TEntityId>
    {
        mockRepo
            .Setup(s =>
                s.CountAsync(
                    It.IsAny<Expression<Func<TEntity, bool>>>(),
                    It.IsAny<Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>>(),
                    It.IsAny<bool>(),
                    It.IsAny<bool>(),
                    It.IsAny<CancellationToken>()
                )
            )
            .ReturnsAsync(
                (
                    Expression<Func<TEntity, bool>> predicate,
                    Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include,
                    bool withDeleted,
                    bool enableTracking,
                    CancellationToken cancellationToken
                ) =>
                {
                    if (!withDeleted)
                        entityList = [.. entityList.Where(e => !e.DeletedDate.HasValue)];
                    return entityList.Count(predicate.Compile());
                }
            );
    }

    private static void SetupAddAsync<TRepository, TEntity, TEntityId>(
        Mock<TRepository> mockRepo,
        List<TEntity> entityList
    )
        where TEntity : Entity<TEntityId>, new()
        where TRepository : class,
            IAsyncRepository<TEntity, TEntityId>,
            IRepository<TEntity, TEntityId>
    {
        mockRepo
            .Setup(r => r.AddAsync(It.IsAny<TEntity>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(
                (TEntity entity, CancellationToken cancellationToken) =>
                {
                    entityList.Add(entity);
                    return entity;
                }
            );
    }

    private static void SetupAddRangeAsync<TRepository, TEntity, TEntityId>(
        Mock<TRepository> mockRepo,
        List<TEntity> entityList
    )
        where TEntity : Entity<TEntityId>, new()
        where TRepository : class,
            IAsyncRepository<TEntity, TEntityId>,
            IRepository<TEntity, TEntityId>
    {
        mockRepo
            .Setup(r =>
                r.AddRangeAsync(It.IsAny<ICollection<TEntity>>(), It.IsAny<CancellationToken>())
            )
            .ReturnsAsync(
                (ICollection<TEntity> entities, CancellationToken cancellationToken) =>
                {
                    entityList.AddRange(entities);
                    return entities;
                }
            );
    }

    private static void SetupUpdateAsync<TRepository, TEntity, TEntityId2>(
        Mock<TRepository> mockRepo,
        List<TEntity> entityList
    )
        where TEntity : Entity<TEntityId2>, new()
        where TRepository : class,
            IAsyncRepository<TEntity, TEntityId2>,
            IRepository<TEntity, TEntityId2>
    {
        mockRepo
            .Setup(r => r.UpdateAsync(It.IsAny<TEntity>(), It.IsAny<CancellationToken>()))!
            .ReturnsAsync(
                (TEntity entity, CancellationToken cancellationToken) =>
                {
                    TEntity? result = entityList.FirstOrDefault(x => x.Id!.Equals(entity.Id));
                    if (result != null)
                        result = entity;
                    return result;
                }
            );
    }

    private static void SetupUpdateRangeAsync<TRepository, TEntity, TEntityId>(
        Mock<TRepository> mockRepo,
        List<TEntity> entityList
    )
        where TEntity : Entity<TEntityId>, new()
        where TRepository : class,
            IAsyncRepository<TEntity, TEntityId>,
            IRepository<TEntity, TEntityId>
    {
        mockRepo
            .Setup(r =>
                r.UpdateRangeAsync(It.IsAny<ICollection<TEntity>>(), It.IsAny<CancellationToken>())
            )
            .ReturnsAsync(
                (ICollection<TEntity> entities, CancellationToken cancellationToken) =>
                {
                    foreach (var entity in entities)
                    {
                        TEntity? result = entityList.FirstOrDefault(x => x.Id!.Equals(entity.Id));
                        if (result != null)
                            result = entity;
                    }
                    return entities;
                }
            );
    }

    private static void SetupDeleteAsync<TRepository, TEntity, TEntityId>(
        Mock<TRepository> mockRepo,
        List<TEntity> entityList
    )
        where TEntity : Entity<TEntityId>, new()
        where TRepository : class,
            IAsyncRepository<TEntity, TEntityId>,
            IRepository<TEntity, TEntityId>
    {
        mockRepo
            .Setup(r =>
                r.DeleteAsync(It.IsAny<TEntity>(), It.IsAny<bool>(), It.IsAny<CancellationToken>())
            )
            .ReturnsAsync(
                (TEntity entity, bool permanent, CancellationToken cancellationToken) =>
                {
                    if (!permanent)
                        entity.DeletedDate = DateTime.UtcNow;
                    else
                        entityList.Remove(entity);
                    return entity;
                }
            );
    }

    private static void SetupDeleteRangeAsync<TRepository, TEntity, TEntityId>(
        Mock<TRepository> mockRepo,
        List<TEntity> entityList
    )
        where TEntity : Entity<TEntityId>, new()
        where TRepository : class,
            IAsyncRepository<TEntity, TEntityId>,
            IRepository<TEntity, TEntityId>
    {
        mockRepo
            .Setup(r =>
                r.DeleteRangeAsync(
                    It.IsAny<ICollection<TEntity>>(),
                    It.IsAny<bool>(),
                    It.IsAny<CancellationToken>()
                )
            )
            .ReturnsAsync(
                (
                    ICollection<TEntity> entities,
                    bool permanent,
                    CancellationToken cancellationToken
                ) =>
                {
                    foreach (var entity in entities)
                    {
                        if (!permanent)
                            entity.DeletedDate = DateTime.UtcNow;
                        else
                            entityList.Remove(entity);
                    }
                    return entities;
                }
            );
    }
}
