namespace AApplication.Features.Colonies.Commands.Create;

using FluentValidation;

public class CreateColonyCommandValidator : AbstractValidator<CreateColonyCommand>
{
    public CreateColonyCommandValidator()
    {
        RuleFor(c => c.Name).NotEmpty().MaximumLength(100);
        RuleFor(c => c.Commander).NotEmpty().MaximumLength(100);
        RuleFor(c => c.Planet).NotEmpty().MaximumLength(100);
        RuleFor(c => c.Location).NotEmpty().MaximumLength(150);
    }
}
