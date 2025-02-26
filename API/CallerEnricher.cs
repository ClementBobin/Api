using System.Diagnostics;
using Serilog.Core;
using Serilog.Events;

public class StackTraceEnricher : ILogEventEnricher
{
    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
    {
        // Get caller from the stack trace
        var caller = GetCallerFromStackTrace();

        // Get Unix timestamp
        var unixTimestamp = logEvent.Timestamp.ToUnixTimeSeconds();

        // Add properties
        logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("UnixTimestamp", unixTimestamp));
        logEvent.AddOrUpdateProperty(propertyFactory.CreateProperty("Caller", caller));
    }

    // Extracts caller method from the stack trace
    private string GetCallerFromStackTrace()
    {
        try
        {
            var stackTrace = new StackTrace();
            var callingMethod = stackTrace.GetFrames()
                .Skip(14)  // Skip Serilog internals and the current method calls 13
                .FirstOrDefault()?
                .GetMethod();

            return callingMethod != null ? $"{callingMethod.DeclaringType?.Name}.{callingMethod.Name}" : "Unknown";
        }
        catch (Exception)
        {
            return "Unknown";  // Fallback in case of an error
        }
    }
}
