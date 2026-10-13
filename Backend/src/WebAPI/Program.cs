using Application;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Controller ve API Desteği
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger Servisi (Varsayılan ayarlarla temiz kurulum)
builder.Services.AddSwaggerGen();

// Katman Servis Kayıtları
builder.Services.AddApplicationServices();
builder.Services.AddPersistenceServices(builder.Configuration);

// CORS Yapılandırması (Frontend ile haberleşebilmek için)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// Swagger UI Aktifleştirme
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
