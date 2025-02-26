namespace DTO
{
    public class HealthResponse
    {
        public string Status { get; set; }
        public string Version { get; set; }
        public DateTime DateTime { get; set; }
        public TimeSpan TimeResponse { get; set; }
    }
}
