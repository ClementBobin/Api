using DAL;
using BL;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Serilog;
using System.Reflection;
using Microsoft.OpenApi.Models;

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
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "IoT API",
        Description = "An ASP.NET Core Web API for managing IoT Data",
    });

    // TODO: Add servers based on the environment
    //// Default production server
    //options.AddServer(new OpenApiServer
    //{
    //    Url = "https://api.example.com", // Production URL
    //    Description = "Production Server"
    //});

    //// Read the environment from the configuration
    //var environment = builder.Environment.EnvironmentName;
    //Log.Information($"Current environment: {environment}");

    //// List of servers to add based on the environment
    //var servers = new List<OpenApiServer>();

    //if (environment == "Development")
    //{
    //    Log.Information("Development environment detected.");

    //    // Attempt to read all profiles from launchSettings.json
    //    var profiles = builder.Configuration.GetSection("Profiles").GetChildren();
    //    Log.Information("Profiles found in configuration:");

    //    foreach (var profile in profiles)
    //    {
    //        Log.Information($"Profile: {profile.Key}");
    //        foreach (var property in profile.AsEnumerable())
    //        {
    //            Log.Information($"  {property.Key}: {property.Value}");
    //        }
    //    }

    //    // Look for the correct profile (either "http", "https", or "IIS Express")
    //    var selectedProfile = profiles.FirstOrDefault(p => p.Key == "http" || p.Key == "https" || p.Key == "IIS Express");

    //    if (selectedProfile != null)
    //    {
    //        // Get the applicationUrl(s) from the selected profile
    //        var applicationUrls = selectedProfile["applicationUrl"];
    //        Log.Information($"Found applicationUrl(s): {applicationUrls}");

    //        if (!string.IsNullOrEmpty(applicationUrls))
    //        {
    //            // Parse the URLs if multiple URLs are present (separated by semicolon)
    //            var urls = applicationUrls.Split(';');
    //            foreach (var url in urls)
    //            {
    //                var trimmedUrl = url.Trim();
    //                Log.Information($"Checking URL: {trimmedUrl}");

    //                if (Uri.IsWellFormedUriString(trimmedUrl, UriKind.Absolute))
    //                {
    //                    Log.Information($"Adding server URL: {trimmedUrl}");
    //                    servers.Add(new OpenApiServer { Url = trimmedUrl });
    //                }
    //                else
    //                {
    //                    Log.Warning($"Skipping malformed URL: {trimmedUrl}");
    //                }
    //            }
    //        }
    //        else
    //        {
    //            Log.Warning("No valid applicationUrl found in the selected profile.");
    //        }
    //    }
    //    else
    //    {
    //        Log.Warning("No matching profile (http, https, IIS Express) found in the configuration.");
    //    }
    //}
    //else if (environment == "Staging")
    //{
    //    servers.Add(new OpenApiServer { Url = "https://staging.example.com" });
    //}

    //// Dynamically add servers to Swagger
    //foreach (var server in servers)
    //{
    //    options.AddServer(server);
    //}

    // Include XML comments for better documentation
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

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

app.Run();
