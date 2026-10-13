using FluentValidation;

namespace Application.Features.Buildings.Commands.Create;

public class CreateBuildingCommandValidator : AbstractValidator<CreateBuildingCommand>
{
    public CreateBuildingCommandValidator()
    {
        RuleFor(c => c.ColonyId).GreaterThan(0);
        RuleFor(c => c.Name).NotEmpty().MinimumLength(2).MaximumLength(100);
        RuleFor(c => c.BuildingType).IsInEnum();
        RuleFor(c => c.MaxWorkers).GreaterThanOrEqualTo(0);
    }
}
