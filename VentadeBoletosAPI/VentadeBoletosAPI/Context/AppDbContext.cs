using Microsoft.EntityFrameworkCore;
using VentadeBoletosAPI.Models;

namespace VentadeBoletosAPI.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Zona> Zonas { get; set; }
        public DbSet<Asiento> Asientos { get; set; }
        public DbSet<Boleto> Boletos { get; set; }
        public DbSet<Pago> Pagos { get; set; }


        // Métodos para llamar a funciones almacenadas 
        public async Task<int> VerificarCredencialesAsync(string email, string contrasenia)
        {
            var result = await Database.SqlQueryRaw<int>(
                $"SELECT VerificarCredenciales('{{0}}', '{{1}}');",
                parameters: new object[] { email, contrasenia }
            ).ToListAsync();

            return result.FirstOrDefault();
        }

    }
}
