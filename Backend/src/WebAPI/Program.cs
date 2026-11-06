using Application;
using Persistence;
using Persistence.Contexts;

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

// Otomatik Veritabanı Başlatma (InMemory veya eksik tablo kontrolü)
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<BaseDbContext>();
    if (dbContext.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
    {
        DbInitializer.Initialize(dbContext);
    }
}

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
