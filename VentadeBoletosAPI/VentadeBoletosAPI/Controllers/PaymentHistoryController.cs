using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VentadeBoletosAPI.Context;
using VentadeBoletosAPI.Models;

namespace VentadeBoletosAPI.Controllers
{
    public class PaymentHistoryController : Controller
    {
        private readonly AppDbContext _context;

        public PaymentHistoryController(AppDbContext context)
        {
            _context = context;
        }

        // DTO para la respuesta personalizada
        public class PagoBoletoResponse
        {
            public int Id { get; set; }
            public int PagoId { get; set; }
            public int BoletoId { get; set; }
            public string? CodigoQR { get; set; }
            public string? NumeroAsiento { get; set; }
            public string? FechaPago { get; set; }
            public int? IdUsuario { get; set; }
        }

        [HttpGet("ObtenerHistorialdePagos")]
        public async Task<ActionResult<IEnumerable<PagoBoletoResponse>>> GetHistory()
        {
            var historyPago = await _context.PagoBoletos
                .Include(pb => pb.Boleto)                  
                    .ThenInclude(b => b.Asiento)          
                .Select(pb => new PagoBoletoResponse
                {
                    Id = pb.Id,
                    PagoId = pb.PagoId,
                    BoletoId = pb.BoletoId,
                    CodigoQR = pb.Boleto != null ? pb.Boleto.CodigoQR : null,
                    NumeroAsiento = pb.Boleto != null && pb.Boleto.Asiento != null
                                    ? pb.Boleto.Asiento.NumeroAsiento
                                    : null,
                    FechaPago = pb.Pago != null ? pb.Pago.FechaPago.ToString() : null,
                    IdUsuario = pb.Boleto != null ? pb.Boleto.UsuarioId : 1 //administrador
                })
                .ToListAsync();

            return Ok(historyPago);
        }


    }
}
