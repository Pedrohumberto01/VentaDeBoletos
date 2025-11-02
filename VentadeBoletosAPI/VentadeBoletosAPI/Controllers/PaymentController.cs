using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;
using VentadeBoletosAPI.Context;
using VentadeBoletosAPI.Models;
using VentadeBoletosAPI.Models.Requests;

namespace VentadeBoletosAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public PaymentController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // 🔹 1️⃣ CREAR SESIÓN STRIPE
        [HttpPost("crear-session")]
        public async Task<IActionResult> CrearSessionStripe([FromBody] CrearPagoRequest request)
        {
            if (request == null || !request.BoletosIds.Any())
                return BadRequest("Solicitud inválida.");

            var totalCentavos = (long)((request.Monto / 37) * 100);

            var domain = $"{Request.Scheme}://{Request.Host}";
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
        {
            new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    Currency = "usd",
                    UnitAmount = totalCentavos,
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = $"Boletos Zona {request.ZonaId}",
                        Description = $"Compra de {request.BoletosIds.Count} boletos"
                    }
                },
                Quantity = 1
            }
        },
                Mode = "payment",
                SuccessUrl = $"{domain}/client/pago_exitoso",
                CancelUrl = $"{domain}/client/pago_cancelado"
            };

            var service = new SessionService();
            var session = service.Create(options);

            // 1️⃣ Guardar pago pendiente
            var pago = new Pago
            {
                Monto = request.Monto,
                MetodoPago = "stripe",
                EstadoPago = "pendiente",
                FechaPago = DateTime.UtcNow
            };

            _context.Pagos.Add(pago);
            await _context.SaveChangesAsync();

            // 2️⃣ Crear boletos "reservados"
            foreach (var asientoId in request.BoletosIds)
            {
                var boleto = new Boleto
                {
                    UsuarioId = request.UsuarioId,
                    EventoId = (int)request.EventoId,
                    ZonaId = (int)request.ZonaId,
                    AsientoId = asientoId,
                    Precio = request.Monto / request.BoletosIds.Count,
                    Estado = "pagado",
                    CodigoQR = Guid.NewGuid().ToString() // genera código único
                };

                _context.Boletos.Add(boleto);
                await _context.SaveChangesAsync();

                // 🔸 Marca el asiento como vendido
                var asiento = await _context.Asientos.FindAsync(asientoId);
                if (asiento != null)
                {
                    asiento.Estado = "vendido";
                    _context.Asientos.Update(asiento);
                }

                var pagob = new PagoBoleto
                {
                    PagoId = pago.Id,
                    BoletoId = boleto.Id
                };
                // Vincular boleto con pago
                _context.PagoBoletos.Add(pagob);

                await _context.SaveChangesAsync();
            }

            await _context.SaveChangesAsync();

            return Ok(new { url = session.Url });
        }

        // 🔹 2️⃣ WEBHOOK STRIPE (confirmación automática)
        [HttpPost("webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var endpointSecret = _configuration["Stripe:WebhookSecret"];

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    endpointSecret
                );

                if (stripeEvent.Type == "checkout.session.completed")
                {
                    var session = stripeEvent.Data.Object as Session;

                    var pago = await _context.Pagos
                        .OrderByDescending(p => p.Id)   
                        .Include(p => p.PagoBoletos!)
                        .ThenInclude(pb => pb.Boleto)
                        .FirstOrDefaultAsync(p => p.EstadoPago == "pendiente");

                    if (pago != null)
                    {
                        pago.EstadoPago = "pagado";

                        foreach (var pb in pago.PagoBoletos!)
                        {
                            pb.Boleto!.Estado = "pagado";
                            _context.Boletos.Update(pb.Boleto);
                        }

                        _context.Pagos.Update(pago);
                        await _context.SaveChangesAsync();
                    }
                }

                return Ok();
            }
            catch (StripeException e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
