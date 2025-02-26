using Microsoft.AspNetCore.Mvc;
using BL;
using DTO;
using System.ComponentModel.DataAnnotations;

namespace API.Controllers
{
    /// <summary>
    /// Contrôleur pour gérer les opérations liées aux utilisateurs.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        /// <summary>
        /// Récupère tous les utilisateurs.
        /// </summary>
        /// <returns>Liste des utilisateurs.</returns>
        /// <response code="200">Liste des utilisateurs</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<List<UserGet>> GetAllUser()
        {
            return _userService.GetUsers();
        }

        /// <summary>
        /// Ajoute un utilisateur.
        /// </summary>
        /// <returns>Utilisateur ajouté.</returns>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/user
        ///     {
        ///         "name" : "John Doe",
        ///         "email" : "[email protected]"
        ///     }
        ///     
        /// </remarks>
        /// <response code="201">Utilisateur ajouté</response>
        /// <response code="400">Bad request.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<UserDTO> AddUser([FromBody, Required] UserDTO user)
        {
            if (user == null || string.IsNullOrEmpty(user.Name) || string.IsNullOrEmpty(user.Email))
            {
                return BadRequest("Bad request.");
            }
            return Ok(user);
        }
    }
}
