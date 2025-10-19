namespace VentadeBoletosAPI.Models.Requests
{
    public class CrearPagoRequest
    {
        // Lista de boletos incluidos en el pago
        public List<int> BoletosIds { get; set; } = new List<int>();

        // Método de pago utilizado (tarjeta, paypal, stripe, etc.)
        public string MetodoPago { get; set; } = string.Empty;

        // Monto total del pago (se puede calcular automáticamente en el backend si prefieres)
        public decimal Monto { get; set; }

        // Estado inicial del pago (opcional, normalmente lo gestiona el backend)
        public string EstadoPago { get; set; } = "pendiente";

        // Identificador del usuario que realiza el pago
        public int UsuarioId { get; set; }

        // (Opcional) ID del evento al que pertenecen los boletos
        public int? EventoId { get; set; }
        // (Opcional) ID del evento al que pertenecen los boletos
        public int? ZonaId { get; set; }
    }
}
