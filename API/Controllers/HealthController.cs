using DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Produces("application/json")]
    public class HealthController : ControllerBase
    {
        private readonly ILogger<HealthController> _logger;

        public HealthController(ILogger<HealthController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Check the health status of the API.
        /// </summary>
        /// <returns>Returns a string indicating the health status of the API.</returns>
        /// <response code="200">API is healthy.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet("health")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<HealthResponse> GetHealth()
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                _logger.LogInformation("Health check requested.");
                var response = new HealthResponse
                {
                    Status = "OK",
                    Version = "1.0",
                    DateTime = DateTime.UtcNow,
                    TimeResponse = DateTime.UtcNow - startTime,
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while checking the health status.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { status = "Internal server error" });
            }
        }
    }
}
