using Microsoft.AspNetCore.Mvc;
using BL;
using DTO;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        // Get all devis
        [HttpGet]
        public ActionResult<List<UserDTO>> GetAllUser()
        {
            return _userService.GetUsers();
        }
    }
}
