using Core.Localization.Abstraction;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;

namespace Core.Localization.WebApi;

public class LocalizationMiddleware(RequestDelegate next)
{
    public async Task Invoke(HttpContext context, ILocalizationService localizationService)
    {
        bool queryHasLocale = context.Request.Query.TryGetValue("locale", out StringValues locale);
        if (queryHasLocale)
            localizationService.AcceptLocales = [locale.ToString()];
        else
        {
            IList<StringWithQualityHeaderValue> acceptLanguages = context
                .Request.GetTypedHeaders()
                .AcceptLanguage;
            if (acceptLanguages.Count > 0)
                localizationService.AcceptLocales =
                [
                    .. acceptLanguages
                        .OrderByDescending(x => x.Quality ?? 1)
                        .Select(x => x.Value.ToString()),
                ];
        }

        await next(context);
    }
}
