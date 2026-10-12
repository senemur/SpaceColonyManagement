namespace Core.Application.Pipelines.Caching;

public class RedisOptions
{
    public string Configuration { get; set; }

    public RedisOptions()
    {
        Configuration = string.Empty;
    }

    public RedisOptions(string configuration)
    {
        Configuration = configuration;
    }
}
