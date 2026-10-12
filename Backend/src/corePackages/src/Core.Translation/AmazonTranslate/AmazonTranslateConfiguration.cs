using Amazon;

namespace Core.Translation.AmazonTranslate;

public class AmazonTranslateConfiguration(
    string accessKey,
    string secretKey,
    RegionEndpoint regionEndpoint
)
{
    public string AccessKey { get; } = accessKey;
    public string SecretKey { get; } = secretKey;
    public RegionEndpoint RegionEndpoint { get; } = regionEndpoint;
}
