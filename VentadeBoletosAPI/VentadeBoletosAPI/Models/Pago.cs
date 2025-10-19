using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace VentadeBoletosAPI.Models
{
    public class Pago
    {
        public int Id { get; set; }

        [Column("monto")]
        public decimal Monto { get; set; }

        [Column("metodo_pago")]
        public string MetodoPago { get; set; } = string.Empty;

        [Column("estado_pago")]
        public string EstadoPago { get; set; } = "pendiente";

        [Column("fecha_pago")]
        public DateTime FechaPago { get; set; }

        // Relación: un pago puede tener varios boletos
        public ICollection<PagoBoleto>? PagoBoletos { get; set; }
    }
}
