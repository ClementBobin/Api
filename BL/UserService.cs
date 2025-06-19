using DTO;

namespace BL;

public interface IUserService
{
    List<UserGet> GetUsers();
}

public class UserService : IUserService
{
    private readonly List<UserGet> _users = new()
    {
        new UserGet { Id = 1, Name = "John Doe" },
        new UserGet { Id = 2, Name = "Jane Smith" }
    };

    public List<UserGet> GetUsers()
    {
        return _users;
    }
}