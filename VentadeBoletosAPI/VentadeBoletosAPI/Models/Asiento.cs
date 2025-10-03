using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VentadeBoletosAPI.Models
{
    [Table("asientos")]
    public class Asiento
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("zona_id")]
        public int ZonaId { get; set; }

        [Column("numero_asiento")]
        public string NumeroAsiento { get; set; } = null!;

        [Column("estado")]
        public string Estado { get; set; } = "disponible";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        // Relaciones
        public Zona? Zona { get; set; }
        public ICollection<Boleto>? Boletos { get; set; }
    }
}
