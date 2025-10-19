using System.ComponentModel.DataAnnotations.Schema;

namespace VentadeBoletosAPI.Models
{
    public class PagoBoleto
    {
        public int Id { get; set; }

        [Column("pago_id")]
        public int PagoId { get; set; }
        public Pago? Pago { get; set; }

        [Column("boleto_id")]
        public int BoletoId { get; set; }
        public Boleto? Boleto { get; set; }
    }
}
