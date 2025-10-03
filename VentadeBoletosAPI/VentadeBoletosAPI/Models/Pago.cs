using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VentadeBoletosAPI.Models
{
    [Table("pagos")]
    public class Pago
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("boleto_id")]
        public int BoletoId { get; set; }

        [Column("monto")]
        public decimal Monto { get; set; }

        [Column("metodo_pago")]
        public string MetodoPago { get; set; } = null!;

        [Column("estado_pago")]
        public string EstadoPago { get; set; } = "pendiente";

        [Column("fecha_pago")]
        public DateTime FechaPago { get; set; }

        // Relaciones
        public Boleto? Boleto { get; set; }
    }
}
