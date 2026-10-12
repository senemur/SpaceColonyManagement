using Core.CrossCuttingConcerns.Logging.Abstraction;
using PackageSerilog = Serilog;

namespace Core.CrossCuttingConcerns.Logging.Serilog;

public abstract class SerilogLoggerServiceBase(PackageSerilog.ILogger logger) : ILogger
{
    protected PackageSerilog.ILogger? Logger { get; set; } = logger;

    public void Critical(string message)
    {
        Logger?.Fatal(message);
    }

    public void Debug(string message)
    {
        Logger?.Debug(message);
    }

    public void Error(string message)
    {
        Logger?.Error(message);
    }

    public void Information(string message)
    {
        Logger?.Information(message);
    }

    public void Trace(string message)
    {
        Logger?.Verbose(message);
    }

    public void Warning(string message)
    {
        Logger?.Warning(message);
    }
}
