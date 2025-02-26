using DTO;

namespace BL;

public interface IUserService
{
    List<UserGet> GetUsers();
}

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public List<UserGet> GetUsers()
    {
        return _context.Users.Select(u => new UserGet { Id = u.Id, Name = u.Name }).ToList();
    }
}
