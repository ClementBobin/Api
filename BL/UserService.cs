namespace BL;

using DAL;
using DTO;
using DAL.Entities;
using System.Collections.Generic;
using System.Linq;

public interface IUserService
{
    List<UserDTO> GetUsers();
}

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public List<UserDTO> GetUsers()
    {
        return _context.Users.Select(u => new UserDTO { Id = u.Id, Name = u.Name }).ToList();
    }
}
