using Business.Abstract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Web.Pages.CreateColony;

public class CreateColonyModel : PageModel
{
    private readonly IColonyService _colonyService;

    public CreateColonyModel(IColonyService colonyService)
    {
        _colonyService = colonyService;
    }

    [BindProperty]
    public string ColonyName { get; set; } = string.Empty;

    public void OnGet() { }

    public async Task<IActionResult> OnPostAsync()
    {
        if (string.IsNullOrWhiteSpace(ColonyName))
        {
            ModelState.AddModelError(nameof(ColonyName), "Colony name cannot be empty.");

            return Page();
        }

        await _colonyService.CreateColonyAsync(userId: 1, colonyName: ColonyName);

        return RedirectToPage("/Index");
    }
}
