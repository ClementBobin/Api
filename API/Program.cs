using DAL;
using BL;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Set up Serilog with monthly rolling logs
Log.Logger = new LoggerConfiguration()
    .Enrich.With(new StackTraceEnricher())
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddHostedService<LogRetentionService>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();
// to seed a db
// var scope = app.Services.CreateScope();
// var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
// DatabaseSeeder.Seed(dbContext);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
    app.UseSwagger(options =>
    {
        options.RouteTemplate = "/openapi/{documentName}.json";
    });
    app.MapScalarApiReference();
    // app.MapScalarApiReference(options =>
    // {
    //     // Fluent API
    //     options
    //         .WithTitle("Custom API")
    //         .WithSidebar(false);

    //     // Object initializer
    //     options.Title = "Custom API";
    //     options.ShowSidebar = false;
    // });
}

app.UseAuthorization();

app.UseHttpsRedirection();

app.MapControllers();

// Add health check endpoint
app.MapGet("/health", () => Results.Ok(new { Status = "OK", ResponseTime = DateTime.UtcNow }));

app.Run();