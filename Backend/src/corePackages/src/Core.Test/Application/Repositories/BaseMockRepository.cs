using System.Reflection;
using AutoMapper;
using Core.Application.Rules;
using Core.Localization.Resource.Yaml;
using Core.Persistence.Repositories;
using Core.Test.Application.FakeData;
using Core.Test.Application.Helpers;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace Core.Test.Application.Repositories;

public abstract class BaseMockRepository<
    TRepository,
    TEntity,
    TEntityId,
    TMappingProfile,
    TBusinessRules,
    TFakeData
>
    where TEntity : Entity<TEntityId>, new()
    where TRepository : class, IAsyncRepository<TEntity, TEntityId>, IRepository<TEntity, TEntityId>
    where TMappingProfile : Profile, new()
    where TBusinessRules : BaseBusinessRules
    where TFakeData : BaseFakeData<TEntity, TEntityId>, new()
{
    public IMapper Mapper;
    public Mock<TRepository> MockRepository;
    public TBusinessRules BusinessRules;

    public BaseMockRepository(TFakeData fakeData)
    {
        MapperConfiguration mapperConfig = new(
            c => c.AddProfile<TMappingProfile>(),
            NullLoggerFactory.Instance
        );
        Mapper = mapperConfig.CreateMapper();

        MockRepository = MockRepositoryHelper.GetRepository<TRepository, TEntity, TEntityId>(
            fakeData.Data
        );
        object[] candidateArguments =
        [
            MockRepository.Object,
            new ResourceLocalizationManager(resources: []) { AcceptLocales = ["en"] },
        ];
        ConstructorInfo constructor = typeof(TBusinessRules).GetConstructors().Single();
        object[] orderedArguments =
        [
            .. constructor
                .GetParameters()
                .Select(parameter =>
                    candidateArguments.Single(argument =>
                        parameter.ParameterType.IsInstanceOfType(argument)
                    )
                ),
        ];

        BusinessRules =
            (TBusinessRules?)constructor.Invoke(orderedArguments)
            ?? throw new InvalidOperationException(
                $"Cannot create an instance of {typeof(TBusinessRules).FullName}."
            );
    }
}
