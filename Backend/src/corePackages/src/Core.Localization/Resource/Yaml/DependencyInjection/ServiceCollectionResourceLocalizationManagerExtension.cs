using System.Reflection;
using Core.Localization.Abstraction;
using Microsoft.Extensions.DependencyInjection;

namespace Core.Localization.Resource.Yaml.DependencyInjection;

public static class ServiceCollectionResourceLocalizationManagerExtension
{
    public static IServiceCollection AddYamlResourceLocalization(this IServiceCollection services)
    {
        services.AddScoped<ILocalizationService, ResourceLocalizationManager>(_ =>
        {
            Dictionary<string, Dictionary<string, string>> resources = [];

            string[] featureDirs = Directory.GetDirectories(
                Path.Combine(
                    Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)!,
                    "Features"
                )
            );
            foreach (string featureDir in featureDirs)
            {
                string featureName = Path.GetFileName(featureDir);
                string localeDir = Path.Combine(featureDir, "Resources", "Locales");
                if (Directory.Exists(localeDir))
                {
                    string[] localeFiles = Directory.GetFiles(localeDir);
                    foreach (string localeFile in localeFiles)
                    {
                        string localeName = Path.GetFileNameWithoutExtension(localeFile);
                        int separatorIndex = localeName.IndexOf('.');
                        string localeCulture = localeName[(separatorIndex + 1)..];

                        if (File.Exists(localeFile))
                        {
                            if (!resources.ContainsKey(localeCulture))
                                resources.Add(localeCulture, []);
                            resources[localeCulture].Add(featureName, localeFile);
                        }
                    }
                }
            }

            return new ResourceLocalizationManager(resources);
        });

        return services;
    }
}
