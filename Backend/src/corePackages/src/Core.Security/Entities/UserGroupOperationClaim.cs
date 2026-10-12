using Core.Persistence.Repositories;

namespace Core.Security.Entities;

public class UserGroupOperationClaim<TId, TUserGroupId, TOperationClaimId> : Entity<TId>
{
    public TUserGroupId UserGroupId { get; set; }
    public TOperationClaimId OperationClaimId { get; set; }

    public UserGroupOperationClaim()
    {
        UserGroupId = default!;
        OperationClaimId = default!;
    }

    public UserGroupOperationClaim(TUserGroupId userGroupId, TOperationClaimId operationClaimId)
    {
        UserGroupId = userGroupId;
        OperationClaimId = operationClaimId;
    }

    public UserGroupOperationClaim(
        TId id,
        TUserGroupId userGroupId,
        TOperationClaimId operationClaimId
    )
        : base(id)
    {
        UserGroupId = userGroupId;
        OperationClaimId = operationClaimId;
    }
}
