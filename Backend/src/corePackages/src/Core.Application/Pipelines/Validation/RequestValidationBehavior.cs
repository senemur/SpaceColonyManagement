using Core.CrossCuttingConcerns.Exception.Types;
using FluentValidation;
using MediatR;
using ValidationException = Core.CrossCuttingConcerns.Exception.Types.ValidationException;

namespace Core.Application.Pipelines.Validation;

public class RequestValidationBehavior<TRequest, TResponse>(
    IEnumerable<IValidator<TRequest>> validators
) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        ValidationContext<object> context = new(request);
        IEnumerable<ValidationExceptionModel> errors =
        [
            .. validators
                .Select(validator => validator.Validate(context))
                .SelectMany(result => result.Errors)
                .Where(failure => failure != null)
                .GroupBy(
                    keySelector: p => p.PropertyName,
                    resultSelector: (propertyName, errors) =>
                        new ValidationExceptionModel
                        {
                            Property = propertyName,
                            Errors = errors.Select(e => new ValidationErrorModel()
                            {
                                Code = e.ErrorCode,
                                Message = e.ErrorMessage,
                            }),
                        }
                ),
        ];

        if (errors.Any())
            throw new ValidationException(errors);
        TResponse response = await next(cancellationToken);
        return response;
    }
}
