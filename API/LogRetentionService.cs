

    public class LogRetentionService : BackgroundService
    {
        private readonly string _logDirectory;
        private readonly ILogger<LogRetentionService> _logger;

        // Constructor to inject the logger and configuration
        public LogRetentionService(ILogger<LogRetentionService> logger, IConfiguration configuration)
        {
            _logger = logger;
            _logDirectory = Path.GetDirectoryName(configuration["Serilog:WriteTo:1:Args:path"]) ?? "Logs";
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("LogRetentionService started. Log directory: {LogDirectory}", _logDirectory);

            while (!stoppingToken.IsCancellationRequested)
            {
                // Check and delete log files older than 6 months
                DeleteOldLogFiles();

                // Wait for 10 days before checking again
                await Task.Delay(TimeSpan.FromDays(10), stoppingToken);
            }

            _logger.LogInformation("LogRetentionService stopped.");
        }

        private void DeleteOldLogFiles()
        {
            try
            {
                if (!Directory.Exists(_logDirectory))
                {
                    _logger.LogWarning("Log directory does not exist: {LogDirectory}", _logDirectory);
                    return;
                }

                var logFiles = Directory.GetFiles(_logDirectory, "*.log");

                if (logFiles.Length == 0)
                {
                    _logger.LogInformation("No log files found in the directory.");
                }

                foreach (var file in logFiles)
                {
                    var fileInfo = new FileInfo(file);
                    if (fileInfo.CreationTime < DateTime.UtcNow.AddMonths(-6))
                    {
                        try
                        {
                            fileInfo.Delete();
                            _logger.LogInformation("Deleted old log file: {LogFile}", fileInfo.FullName);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Error deleting log file: {LogFile}", fileInfo.FullName);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteOldLogFiles.");
            }
        }
    }

