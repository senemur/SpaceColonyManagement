using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Core.Security.Encryption;
using Core.Security.Entities;
using Core.Security.Extensions;
using Microsoft.IdentityModel.Tokens;

namespace Core.Security.JWT;

public class JwtHelper<TUserId, TOperationClaimId, TRefreshTokenId>(TokenOptions tokenOptions)
    : ITokenHelper<TUserId, TOperationClaimId, TRefreshTokenId>
{
    public virtual AccessToken CreateToken(
        User<TUserId> user,
        IList<OperationClaim<TOperationClaimId>> operationClaims
    )
    {
        DateTime accessTokenExpiration = DateTime.Now.AddMinutes(
            tokenOptions.AccessTokenExpiration
        );
        SecurityKey securityKey = SecurityKeyHelper.CreateSecurityKey(tokenOptions.SecurityKey);
        SigningCredentials signingCredentials = SigningCredentialsHelper.CreateSigningCredentials(
            securityKey
        );
        JwtSecurityToken jwt = CreateJwtSecurityToken(
            tokenOptions,
            user,
            signingCredentials,
            operationClaims,
            accessTokenExpiration
        );
        JwtSecurityTokenHandler jwtSecurityTokenHandler = new();
        string? token = jwtSecurityTokenHandler.WriteToken(jwt);

        return new AccessToken() { Token = token, ExpirationDate = accessTokenExpiration };
    }

    public RefreshToken<TRefreshTokenId, TUserId> CreateRefreshToken(
        User<TUserId> user,
        string ipAddress
    )
    {
        return new RefreshToken<TRefreshTokenId, TUserId>()
        {
            UserId = user.Id,
            Token = RandomRefreshToken(),
            ExpirationDate = DateTime.UtcNow.AddDays(tokenOptions.RefreshTokenTTL),
            CreatedByIp = ipAddress,
        };
    }

    public virtual JwtSecurityToken CreateJwtSecurityToken(
        TokenOptions tokenOptions,
        User<TUserId> user,
        SigningCredentials signingCredentials,
        IList<OperationClaim<TOperationClaimId>> operationClaims,
        DateTime accessTokenExpiration
    )
    {
        return new JwtSecurityToken(
            tokenOptions.Issuer,
            tokenOptions.Audience,
            expires: accessTokenExpiration,
            notBefore: DateTime.Now,
            claims: SetClaims(user, operationClaims),
            signingCredentials: signingCredentials
        );
    }

    protected virtual IEnumerable<Claim> SetClaims(
        User<TUserId> user,
        IList<OperationClaim<TOperationClaimId>> operationClaims
    )
    {
        List<Claim> claims = [];
        claims.AddNameIdentifier(user!.Id!.ToString()!);
        claims.AddEmail(user.Email);
        claims.AddRoles([.. operationClaims.Select(c => c.Name)]);
        return [.. claims];
    }

    private string RandomRefreshToken()
    {
        byte[] numberByte = new byte[32];
        using var random = RandomNumberGenerator.Create();
        random.GetBytes(numberByte);
        return Convert.ToBase64String(numberByte);
    }
}
