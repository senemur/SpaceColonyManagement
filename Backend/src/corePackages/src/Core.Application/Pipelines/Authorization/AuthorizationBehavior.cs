using Core.CrossCuttingConcerns.Exception.Types;
using Core.Security.Constants;
using Core.Security.Extensions;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Core.Application.Pipelines.Authorization;

public class AuthorizationBehavior<TRequest, TResponse>(IHttpContextAccessor httpContextAccessor)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, ISecuredRequest
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        if (!httpContextAccessor.HttpContext.User.Claims.Any())
            throw new AuthorizationException("You are not authenticated.");

        if (request.Roles.Length != 0)
        {
            ICollection<string>? userRoleClaims =
                httpContextAccessor.HttpContext.User.GetRoleClaims() ?? [];
            bool isNotMatchedAUserRoleClaimWithRequestRoles =
                userRoleClaims.FirstOrDefault(userRoleClaim =>
                    userRoleClaim == GeneralOperationClaims.Admin
                    || request.Roles.Contains(userRoleClaim)
                ) == null;
            if (isNotMatchedAUserRoleClaimWithRequestRoles)
                throw new AuthorizationException("You are not authorized.");
        }

        TResponse response = await next(cancellationToken);
        return response;
    }
}
