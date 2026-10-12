using System.Collections;
using System.Drawing;
using System.Linq.Expressions;
using System.Reflection;
using Core.Persistence.Dynamic;
using Core.Persistence.Paging;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Query;

namespace Core.Persistence.Repositories;

public class EfRepositoryBase<TEntity, TEntityId, TContext>(TContext context)
    : IAsyncRepository<TEntity, TEntityId>,
        IRepository<TEntity, TEntityId>
    where TEntity : Entity<TEntityId>
    where TContext : DbContext
{
    public IQueryable<TEntity> Query()
    {
        return context.Set<TEntity>();
    }

    public async Task<TEntity?> GetAsync(
        Expression<Func<TEntity, bool>>? predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        IQueryable<TEntity> queryable = Query();
        if (!enableTracking)
            queryable = queryable.AsNoTracking();
        if (include != null)
            queryable = include(queryable);
        if (withDeleted)
            queryable = queryable.IgnoreQueryFilters();
        if (predicate != null)
            queryable = queryable.Where(predicate);
        if (orderBy != null)
            queryable = orderBy(queryable);
        return await queryable.FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<ICollection<TEntity>> GetAllAsync(
        Expression<Func<TEntity, bool>>? predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        IQueryable<TEntity> queryable = Query();
        if (!enableTracking)
            queryable = queryable.AsNoTracking();
        if (include != null)
            queryable = include(queryable);
        if (withDeleted)
            queryable = queryable.IgnoreQueryFilters();
        if (predicate != null)
            queryable = queryable.Where(predicate);
        if (orderBy != null)
            queryable = orderBy(queryable);
        return await queryable.ToListAsync(cancellationToken);
    }

    public async Task<IPaginate<TEntity>> GetListAsync(
        Expression<Func<TEntity, bool>>? predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
        int index = 0,
        int size = 10,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        IQueryable<TEntity> queryable = Query();
        if (!enableTracking)
            queryable = queryable.AsNoTracking();
        if (include != null)
            queryable = include(queryable);
        if (withDeleted)
            queryable = queryable.IgnoreQueryFilters();
        if (predicate != null)
            queryable = queryable.Where(predicate);
        if (orderBy != null)
            queryable = orderBy(queryable);
        return await queryable.ToPaginateAsync(index, size, from: 0, cancellationToken);
    }

    public async Task<IPaginate<TEntity>> GetListByDynamicAsync(
        DynamicQuery dynamic,
        Expression<Func<TEntity, bool>>? predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
        int index = 0,
        int size = 10,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        IQueryable<TEntity> queryable = Query().ToDynamic(dynamic);
        if (!enableTracking)
            queryable = queryable.AsNoTracking();
        if (include != null)
            queryable = include(queryable);
        if (withDeleted)
            queryable = queryable.IgnoreQueryFilters();
        if (predicate != null)
            queryable = queryable.Where(predicate);
        if (orderBy != null)
            queryable = orderBy(queryable);
        return await queryable.ToPaginateAsync(index, size, from: 0, cancellationToken);
    }

    public async Task<bool> AnyAsync(
        Expression<Func<TEntity, bool>>? predicate = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        IQueryable<TEntity> queryable = Query();
        if (!enableTracking)
            queryable = queryable.AsNoTracking();
        if (include != null)
            queryable = include(queryable);
        if (withDeleted)
            queryable = queryable.IgnoreQueryFilters();
        if (predicate != null)
            queryable = queryable.Where(predicate);
        return await queryable.AnyAsync(cancellationToken);
    }

    public async Task<int> CountAsync(
        Expression<Func<TEntity, bool>>? predicate = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        IQueryable<TEntity> queryable = Query();
        if (!enableTracking)
            queryable = queryable.AsNoTracking();
        if (include != null)
            queryable = include(queryable);
        if (withDeleted)
            queryable = queryable.IgnoreQueryFilters();
        if (predicate != null)
            queryable = queryable.Where(predicate);
        return await queryable.CountAsync(cancellationToken);
    }

    public async Task<TEntity> AddAsync(
        TEntity entity,
        CancellationToken cancellationToken = default
    )
    {
        EditEntityPropertiesToAdd(entity);
        await context.AddAsync(entity, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<ICollection<TEntity>> AddRangeAsync(
        ICollection<TEntity> entities,
        CancellationToken cancellationToken = default
    )
    {
        foreach (TEntity entity in entities)
            EditEntityPropertiesToAdd(entity);
        await context.AddRangeAsync(entities, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return entities;
    }

    public async Task<TEntity> UpdateAsync(
        TEntity entity,
        CancellationToken cancellationToken = default
    )
    {
        EditEntityPropertiesToUpdate(entity);
        context.Update(entity);
        await context.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<ICollection<TEntity>> UpdateRangeAsync(
        ICollection<TEntity> entities,
        CancellationToken cancellationToken = default
    )
    {
        foreach (TEntity entity in entities)
            EditEntityPropertiesToUpdate(entity);
        context.UpdateRange(entities);
        await context.SaveChangesAsync(cancellationToken);
        return entities;
    }

    public async Task<TEntity> DeleteAsync(
        TEntity entity,
        bool permanent = false,
        CancellationToken cancellationToken = default
    )
    {
        await SetEntityAsDeleted(entity, permanent, isAsync: true, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<ICollection<TEntity>> DeleteRangeAsync(
        ICollection<TEntity> entities,
        bool permanent = false,
        CancellationToken cancellationToken = default
    )
    {
        await SetEntityAsDeleted(entities, permanent, isAsync: true, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return entities;
    }

    public TEntity? Get(
        Expression<Func<TEntity, bool>>? predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
        bool withDeleted = false,
        bool enableTracking = true
    )
    {
        IQueryable<TEntity> queryable = Query();
        if (!enableTracking)
            queryable = queryable.AsNoTracking();
        if (include != null)
            queryable = include(queryable);
        if (withDeleted)
            queryable = queryable.IgnoreQueryFilters();
        if (predicate != null)
            queryable = queryable.Where(predicate);
        if (orderBy != null)
            queryable = orderBy(queryable);
        return queryable.FirstOrDefault();
    }

    public ICollection<TEntity> GetAll(
        Expression<Func<TEntity, bool>>? predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
        bool withDeleted = false,
        bool enableTracking = true
    )
    {
        IQueryable<TEntity> queryable = Query();
        if (!enableTracking)
            queryable = queryable.AsNoTracking();
        if (include != null)
            queryable = include(queryable);
        if (withDeleted)
            queryable = queryable.IgnoreQueryFilters();
        if (predicate != null)
            queryable = queryable.Where(predicate);
        if (orderBy != null)
            queryable = orderBy(queryable);
        return queryable.ToList();
    }

    public IPaginate<TEntity> GetList(
        Expression<Func<TEntity, bool>>? predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
        int index = 0,
        int size = 10,
        bool withDeleted = false,
        bool enableTracking = true
    )
    {
        IQueryable<TEntity> queryable = Query();
        if (!enableTracking)
            queryable = queryable.AsNoTracking();
        if (include != null)
            queryable = include(queryable);
        if (withDeleted)
            queryable = queryable.IgnoreQueryFilters();
        if (predicate != null)
            queryable = queryable.Where(predicate);
        if (orderBy != null)
            queryable = orderBy(queryable);
        return queryable.ToPaginate(index, size);
    }

    public IPaginate<TEntity> GetListByDynamic(
        DynamicQuery dynamic,
        Expression<Func<TEntity, bool>>? predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
        int index = 0,
        int size = 10,
        bool withDeleted = false,
        bool enableTracking = true
    )
    {
        IQueryable<TEntity> queryable = Query().ToDynamic(dynamic);
        if (!enableTracking)
            queryable = queryable.AsNoTracking();
        if (include != null)
            queryable = include(queryable);
        if (withDeleted)
            queryable = queryable.IgnoreQueryFilters();
        if (predicate != null)
            queryable = queryable.Where(predicate);
        if (orderBy != null)
            queryable = orderBy(queryable);
        return queryable.ToPaginate(index, size);
    }

    public bool Any(
        Expression<Func<TEntity, bool>>? predicate = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
        bool withDeleted = false,
        bool enableTracking = true
    )
    {
        IQueryable<TEntity> queryable = Query();
        if (!enableTracking)
            queryable = queryable.AsNoTracking();
        if (include != null)
            queryable = include(queryable);
        if (withDeleted)
            queryable = queryable.IgnoreQueryFilters();
        if (predicate != null)
            queryable = queryable.Where(predicate);
        return queryable.Any();
    }

    public int Count(
        Expression<Func<TEntity, bool>>? predicate = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
        bool withDeleted = false,
        bool enableTracking = true
    )
    {
        IQueryable<TEntity> queryable = Query();
        if (!enableTracking)
            queryable = queryable.AsNoTracking();
        if (include != null)
            queryable = include(queryable);
        if (withDeleted)
            queryable = queryable.IgnoreQueryFilters();
        if (predicate != null)
            queryable = queryable.Where(predicate);
        return queryable.Count();
    }

    public TEntity Add(TEntity entity)
    {
        EditEntityPropertiesToAdd(entity);
        context.Add(entity);
        context.SaveChanges();
        return entity;
    }

    public ICollection<TEntity> AddRange(ICollection<TEntity> entities)
    {
        foreach (TEntity entity in entities)
            EditEntityPropertiesToAdd(entity);
        context.AddRange(entities);
        context.SaveChanges();
        return entities;
    }

    public TEntity Update(TEntity entity)
    {
        EditEntityPropertiesToAdd(entity);
        context.Update(entity);
        context.SaveChanges();
        return entity;
    }

    public ICollection<TEntity> UpdateRange(ICollection<TEntity> entities)
    {
        foreach (TEntity entity in entities)
            EditEntityPropertiesToAdd(entity);
        context.UpdateRange(entities);
        context.SaveChanges();
        return entities;
    }

    public TEntity Delete(TEntity entity, bool permanent = false)
    {
        SetEntityAsDeleted(entity, permanent, isAsync: false).Wait();
        context.SaveChanges();
        return entity;
    }

    public ICollection<TEntity> DeleteRange(ICollection<TEntity> entities, bool permanent = false)
    {
        SetEntityAsDeleted(entities, permanent, isAsync: false).Wait();
        context.SaveChanges();
        return entities;
    }

    protected virtual void EditEntityPropertiesToAdd(TEntity entity)
    {
        entity.CreatedDate = DateTime.UtcNow;
    }

    protected virtual void EditEntityPropertiesToDelete(TEntity entity)
    {
        entity.DeletedDate = DateTime.UtcNow;
    }

    protected virtual void EditEntityPropertiesToUpdate(TEntity entity)
    {
        entity.UpdatedDate = DateTime.UtcNow;
    }

    protected virtual bool IsSoftDeleted(IEntityTimestamps entity)
    {
        return entity.DeletedDate.HasValue;
    }

    protected virtual void EditRelationEntityPropertiesToCascadeSoftDelete(IEntityTimestamps entity)
    {
        entity.DeletedDate = DateTime.UtcNow;
    }

    protected async Task SetEntityAsDeleted(
        TEntity entity,
        bool permanent,
        bool isAsync = true,
        CancellationToken cancellationToken = default
    )
    {
        if (!permanent)
        {
            CheckHasEntityHaveOneToOneRelation(entity);
            if (isAsync)
                await SetEntityAsSoftDeleted(entity, isAsync, cancellationToken);
            else
                SetEntityAsSoftDeleted(entity, isAsync).Wait(cancellationToken);
        }
        else
            context.Remove(entity);
    }

    protected async Task SetEntityAsDeleted(
        IEnumerable<TEntity> entities,
        bool permanent,
        bool isAsync = true,
        CancellationToken cancellationToken = default
    )
    {
        foreach (TEntity entity in entities)
            await SetEntityAsDeleted(entity, permanent, isAsync, cancellationToken);
    }

    protected void CheckHasEntityHaveOneToOneRelation(TEntity entity)
    {
        IEnumerable<IForeignKey> foreignKeys = context.Entry(entity).Metadata.GetForeignKeys();
        IForeignKey? oneToOneForeignKey = foreignKeys.FirstOrDefault(fk =>
            fk.IsUnique
            && fk.PrincipalKey.Properties.All(pk =>
                context.Entry(entity).Property(pk.Name).Metadata.IsPrimaryKey()
            )
        );

        if (oneToOneForeignKey != null)
        {
            string relatedEntity = oneToOneForeignKey.PrincipalEntityType.ClrType.Name;
            IReadOnlyList<IProperty> primaryKeyProperties = context
                .Entry(entity)
                .Metadata.FindPrimaryKey()!
                .Properties;
            string primaryKeyNames = string.Join(
                ", ",
                primaryKeyProperties.Select(prop => prop.Name)
            );
            throw new InvalidOperationException(
                $"Entity {entity.GetType().Name} has a one-to-one relationship with {relatedEntity} via the primary key ({primaryKeyNames}). Soft Delete causes problems if you try to create an entry again with the same foreign key."
            );
        }
    }

    protected IQueryable<object>? GetRelationLoaderQuery(
        IQueryable query,
        Type navigationPropertyType
    )
    {
        Type queryProviderType = query.Provider.GetType();
        MethodInfo createQueryMethod =
            queryProviderType
                .GetMethods()
                .First(m =>
                    m is { Name: nameof(query.Provider.CreateQuery), IsGenericMethod: true }
                )
                ?.MakeGenericMethod(navigationPropertyType)
            ?? throw new InvalidOperationException(
                "CreateQuery<TElement> method is not found in IQueryProvider."
            );
        var queryProviderQuery =
            (IQueryable<object>)
                createQueryMethod.Invoke(query.Provider, parameters: [query.Expression])!;
        return queryProviderQuery.Where(x => !((IEntityTimestamps)x).DeletedDate.HasValue);
    }

    private async Task SetEntityAsSoftDeleted(
        IEntityTimestamps entity,
        bool isAsync = true,
        CancellationToken cancellationToken = default,
        bool isRoot = true
    )
    {
        if (IsSoftDeleted(entity))
            return;
        if (isRoot)
            EditEntityPropertiesToDelete((TEntity)entity);
        else
            EditRelationEntityPropertiesToCascadeSoftDelete(entity);

        var navigations = context
            .Entry(entity)
            .Metadata.GetNavigations()
            .Where(x =>
                x
                    is {
                        IsOnDependent: false,
                        ForeignKey.DeleteBehavior: DeleteBehavior.ClientCascade
                            or DeleteBehavior.Cascade
                    }
            )
            .ToList();
        foreach (INavigation? navigation in navigations)
        {
            if (navigation.TargetEntityType.IsOwned())
                continue;
            if (navigation.PropertyInfo == null)
                continue;

            object? navValue = navigation.PropertyInfo.GetValue(entity);
            if (navigation.IsCollection)
            {
                if (navValue == null)
                {
                    IQueryable query = context
                        .Entry(entity)
                        .Collection(navigation.PropertyInfo.Name)
                        .Query();

                    if (isAsync)
                    {
                        IQueryable<object>? relationLoaderQuery = GetRelationLoaderQuery(
                            query,
                            navigationPropertyType: navigation.PropertyInfo.GetType()
                        );
                        if (relationLoaderQuery is not null)
                            navValue = await relationLoaderQuery.ToListAsync(cancellationToken);
                    }
                    else
                        navValue = GetRelationLoaderQuery(
                            query,
                            navigationPropertyType: navigation.PropertyInfo.GetType()
                        )
                            ?.ToList();

                    if (navValue == null)
                        continue;
                }

                foreach (object navValueItem in (IEnumerable)navValue)
                    await SetEntityAsSoftDeleted(
                        (IEntityTimestamps)navValueItem,
                        isAsync,
                        cancellationToken,
                        isRoot: false
                    );
            }
            else
            {
                if (navValue == null)
                {
                    IQueryable query = context
                        .Entry(entity)
                        .Reference(navigation.PropertyInfo.Name)
                        .Query();

                    if (isAsync)
                    {
                        IQueryable<object>? relationLoaderQuery = GetRelationLoaderQuery(
                            query,
                            navigationPropertyType: navigation.PropertyInfo.GetType()
                        );
                        if (relationLoaderQuery is not null)
                            navValue = await relationLoaderQuery.FirstOrDefaultAsync(
                                cancellationToken
                            );
                    }
                    else
                        navValue = GetRelationLoaderQuery(
                            query,
                            navigationPropertyType: navigation.PropertyInfo.GetType()
                        )
                            ?.FirstOrDefault();

                    if (navValue == null)
                        continue;
                }

                await SetEntityAsSoftDeleted(
                    (IEntityTimestamps)navValue,
                    isAsync,
                    cancellationToken,
                    isRoot: false
                );
            }
        }

        context.Update(entity);
    }
}
