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
        public DbSet<PagoBoleto> PagoBoletos { get; set; }

        public DbSet<RolResult> RolResult { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 👇 Muy importante: indicar que RolResult NO tiene clave primaria
            modelBuilder.Entity<RolResult>().HasNoKey();

            modelBuilder.Entity<PagoBoleto>()
               .HasKey(pb => pb.Id);

            modelBuilder.Entity<PagoBoleto>()
                .HasOne(pb => pb.Pago)
                .WithMany(p => p.PagoBoletos)
                .HasForeignKey(pb => pb.PagoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PagoBoleto>()
                .HasOne(pb => pb.Boleto)
                .WithMany(b => b.PagoBoletos)
                .HasForeignKey(pb => pb.BoletoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PagoBoleto>(entity =>
            {
                entity.ToTable("pagoboletos");

                entity.Property(pb => pb.PagoId).HasColumnName("pago_id");
                entity.Property(pb => pb.BoletoId).HasColumnName("boleto_id");
            });

        }
    }
}
