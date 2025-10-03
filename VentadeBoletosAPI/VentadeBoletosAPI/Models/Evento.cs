using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VentadeBoletosAPI.Models
{
    [Table("eventos")]
    public class Evento
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nombre")]
        [Required]
        public string Nombre { get; set; } = null!;

        [Column("descripcion")]
        public string? Descripcion { get; set; }

        [Column("fecha")]
        public DateTime Fecha { get; set; }

        [Column("hora")]
        public TimeSpan Hora { get; set; }

        [Column("imagen")]
        public string? Imagen { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        // Relaciones
        public ICollection<Boleto>? Boletos { get; set; }
    }
}
