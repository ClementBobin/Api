using Microsoft.AspNetCore.Mvc;
using BL;
using DTO;
using Microsoft.AspNetCore.Antiforgery;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAntiforgery _antiforgery;

        public UserController(IUserService userService, IAntiforgery antiforgery)
        {
            _userService = userService;
            _antiforgery = antiforgery;
        }

        // Get all devis
        [HttpGet]
        public ActionResult<List<UserDTO>> GetAllUser()
        {
            return _userService.GetUsers();
        }
    }
}
