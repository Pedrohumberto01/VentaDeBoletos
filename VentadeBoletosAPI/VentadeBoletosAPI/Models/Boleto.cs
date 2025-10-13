using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace VentadeBoletosAPI.Models
{
    [Table("boletos")]
    public class Boleto
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("usuario_id")]
        public int UsuarioId { get; set; }

        [Column("evento_id")]
        public int EventoId { get; set; }

        [Column("zona_id")]
        public int ZonaId { get; set; }

        [Column("asiento_id")]
        public int? AsientoId { get; set; }

        [Column("precio")]
        public decimal Precio { get; set; }

        [Column("estado")]
        public string Estado { get; set; } = "reservado";

        [Column("codigo_qr")]
        public string? CodigoQR { get; set; }

        [Column("created_at")]
        public DateTime Created_At { get; set; } = DateTime.UtcNow;
        [Column("updated_at")]
        public DateTime Updated_At { get; set; } = DateTime.UtcNow;
    }
}
