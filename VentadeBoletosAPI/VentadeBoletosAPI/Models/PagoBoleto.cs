using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VentadeBoletosAPI.Models
{
    [Table("pagoboletos")]
    public class PagoBoleto
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("pago_id")]
        public int PagoId { get; set; }

        [Column("boleto_id")]
        public int BoletoId { get; set; }

        [ForeignKey("PagoId")]
        public Pago Pago { get; set; }

        [ForeignKey("BoletoId")]
        public Boleto Boleto { get; set; }
    }
}
