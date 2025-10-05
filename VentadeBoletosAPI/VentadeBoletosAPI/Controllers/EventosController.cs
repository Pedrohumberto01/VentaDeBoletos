using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VentadeBoletosAPI.Context;
using VentadeBoletosAPI.Models;

namespace VentadeBoletosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EventosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("ObtenerEventos")]
        public async Task<ActionResult<IEnumerable<Evento>>> GetEventos()
        {
            return await _context.Eventos.ToListAsync();
        }

        [HttpPost("CrearEvento")]
        public async Task<ActionResult<Evento>> PostEvento(Evento evento)
        {
            _context.Eventos.Add(evento);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEventos), new { id = evento.Id }, evento);
        }
    }
}
