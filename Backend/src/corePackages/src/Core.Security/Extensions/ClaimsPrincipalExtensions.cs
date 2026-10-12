using System.Collections.Immutable;
using System.Security.Claims;

namespace Core.Security.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static ICollection<string>? GetClaims(
        this ClaimsPrincipal claimsPrincipal,
        string claimType
    )
    {
        return claimsPrincipal?.FindAll(claimType)?.Select(x => x.Value).ToImmutableArray();
    }

    public static ICollection<string>? GetRoleClaims(this ClaimsPrincipal claimsPrincipal)
    {
        return claimsPrincipal?.GetClaims(ClaimTypes.Role);
    }

    public static string? GetIdClaim(this ClaimsPrincipal claimsPrincipal)
    {
        return claimsPrincipal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}
