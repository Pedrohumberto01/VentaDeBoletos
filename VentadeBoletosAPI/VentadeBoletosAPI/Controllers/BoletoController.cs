using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VentadeBoletosAPI.Context;
using VentadeBoletosAPI.Models;

namespace VentadeBoletosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BoletoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BoletoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("GenararQR")]
        public async Task<IActionResult> GenerarQR([FromBody] int boletoId)
        {
            Boleto boleto = await _context.Boletos.FindAsync(boletoId);
            if (boleto == null)
                return NotFound("Boleto no encontrado");


            var qrCode = boleto.CodigoQR;
            //Generar QR con la data de qrCode



            


            //si todo sale bien retornar
            return Ok(new
            {
                mensaje = "QR Generado correctamente",
                qrCode
            });
        }

        // 🔹 POST: api/Boleto/Generar
        [HttpPost("Generar")]
        public async Task<IActionResult> GenerarBoletos([FromBody] GenerarBoletosRequest request)
        {
            if (request == null || request.AsientosSeleccionados == null || !request.AsientosSeleccionados.Any())
                return BadRequest("No se enviaron asientos válidos.");

            try
            {
                var boletos = new List<Boleto>();

                foreach (var asientoId in request.AsientosSeleccionados)
                {
                    var boleto = new Boleto
                    {
                        UsuarioId = request.UsuarioId,  // puede ser fijo o venir del token
                        EventoId = request.EventoId,
                        ZonaId = request.ZonaId,
                        AsientoId = asientoId,
                        Precio = request.PrecioAsiento,
                        Estado = "pagado", // porque el pago es en efectivo
                        CodigoQR = Guid.NewGuid().ToString() // genera código único
                    };

                    boletos.Add(boleto);

                    // 🔸 Marca el asiento como vendido
                    var asiento = await _context.Asientos.FindAsync(asientoId);
                    if (asiento != null)
                    {
                        asiento.Estado = "vendido";
                        _context.Asientos.Update(asiento);
                    }

                }

                await _context.Boletos.AddRangeAsync(boletos);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    mensaje = "Boletos generados exitosamente",
                    boletos 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }
    }

    // 🔹 Modelo auxiliar para recibir los datos del frontend
    public class GenerarBoletosRequest
    {
        public int UsuarioId { get; set; }  
        public int EventoId { get; set; }
        public int ZonaId { get; set; }
        public List<int> AsientosSeleccionados { get; set; } = new();
        public decimal PrecioAsiento { get; set; }
        public decimal Total { get; set; }
        public DateTime Created_At { get; set; } = DateTime.UtcNow;
        public DateTime Updated_At { get; set; } = DateTime.UtcNow;
    }
}
