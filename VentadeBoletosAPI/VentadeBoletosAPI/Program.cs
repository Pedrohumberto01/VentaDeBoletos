using VentadeBoletosAPI.Context;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Obtiene la cadena de conexión
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

var stripeSettings = builder.Configuration.GetSection("Stripe");
Stripe.StripeConfiguration.ApiKey = stripeSettings["SecretKey"];

// Registrar DbContext con MySQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Agregando Servicio del CORS para la app Web
//El navegador le da permisos a la app de consumir las apis
builder.Services.AddCors(options =>
{
    options.AddPolicy("_myAllowSpecificOrigins",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173", "https://localhost:7082", "http://localhost:7082")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});


var app = builder.Build();




// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("_myAllowSpecificOrigins");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
