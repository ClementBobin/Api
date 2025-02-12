using DAL.Entities;

public class DatabaseSeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        if (!context.Users.Any())
        {
            context.Users.AddRange(new User { Name = "Alice", Email = "alice@example.com" },
                                   new User { Name = "Bob", Email = "bob@example.com" });
            context.SaveChanges();
        }
    }
}
