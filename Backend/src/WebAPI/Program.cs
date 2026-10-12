using Application;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Controller ve API Desteği
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Katman Servis Kayıtları
builder.Services.AddApplicationServices();
builder.Services.AddPersistenceServices(builder.Configuration);

// CORS Yapılandırması (Frontend ile haberleşebilmek için)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();