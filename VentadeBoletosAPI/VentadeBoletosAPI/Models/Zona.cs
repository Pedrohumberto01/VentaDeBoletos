using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VentadeBoletosAPI.Models
{
    [Table("zonas")]
    public class Zona
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nombre")]
        [Required]
        public string Nombre { get; set; } = null!;

        [Column("capacidad")]
        public int Capacidad { get; set; }

        [Column("precio")]
        public decimal Precio { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        // Relaciones
        public ICollection<Asiento>? Asientos { get; set; }
        public ICollection<Boleto>? Boletos { get; set; }
    }
}
