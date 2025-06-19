using Scalar.AspNetCore;
using BL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
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