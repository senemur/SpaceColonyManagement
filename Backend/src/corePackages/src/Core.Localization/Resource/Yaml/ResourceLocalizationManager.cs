using System.Data;
using Core.Localization.Abstraction;
using YamlDotNet.RepresentationModel;

namespace Core.Localization.Resource.Yaml;

public class ResourceLocalizationManager : ILocalizationService
{
    private const string DefaultLocale = "en";
    private const string DefaultKeySection = "index";
    public ICollection<string>? AcceptLocales { get; set; }

    private readonly Dictionary<
        string,
        Dictionary<string, (string path, YamlMappingNode? content)>
    > _resourceData = [];

    public ResourceLocalizationManager(Dictionary<string, Dictionary<string, string>> resources)
    {
        foreach ((string locale, Dictionary<string, string> sectionResources) in resources)
        {
            if (!_resourceData.ContainsKey(locale))
                _resourceData.Add(locale, []);

            foreach ((string sectionName, string sectionResourcePath) in sectionResources)
                _resourceData[locale].Add(sectionName, (sectionResourcePath, null));
        }
    }

    public Task<string> GetLocalizedAsync(string key, string? keySection = null)
    {
        return GetLocalizedAsync(
            key,
            AcceptLocales ?? throw new NoNullAllowedException(nameof(AcceptLocales)),
            keySection
        );
    }

    public Task<string> GetLocalizedAsync(
        string key,
        ICollection<string> acceptLocales,
        string? keySection = null
    )
    {
        string? localization;
        if (acceptLocales is not null)
            foreach (string locale in acceptLocales)
            {
                localization = GetLocalizationFromResource(key, locale, keySection);
                if (localization is not null)
                    return Task.FromResult(localization);
            }

        localization = GetLocalizationFromResource(key, DefaultLocale, keySection);
        if (localization is not null)
            return Task.FromResult(localization);

        return Task.FromResult(key);
    }

    private string? GetLocalizationFromResource(
        string key,
        string locale,
        string? keySection = DefaultKeySection
    )
    {
        if (string.IsNullOrWhiteSpace(keySection))
            keySection = DefaultKeySection;

        if (
            _resourceData.TryGetValue(
                locale,
                out Dictionary<string, (string path, YamlMappingNode? content)>? cultureNode
            )
            && cultureNode.TryGetValue(
                keySection,
                out (string path, YamlMappingNode? content) sectionNode
            )
        )
        {
            if (sectionNode.content is null)
                LazyLoadResource(sectionNode.path, out sectionNode.content);

            if (
                sectionNode.content!.Children.TryGetValue(
                    new YamlScalarNode(key),
                    out YamlNode? cultureValueNode
                )
            )
                return cultureValueNode.ToString();
        }

        return null;
    }

    private void LazyLoadResource(string path, out YamlMappingNode? content)
    {
        using StreamReader reader = new(path);
        YamlStream yamlStream = [];
        yamlStream.Load(reader);
        content = (YamlMappingNode)yamlStream.Documents[0].RootNode;
    }
}
