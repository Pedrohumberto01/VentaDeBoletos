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

        // 🔹 Obtener todos los eventos
        [HttpGet("ObtenerEventos")]
        public async Task<ActionResult<IEnumerable<Evento>>> GetEventos()
        {
            return await _context.Eventos.ToListAsync();
        }

        // 🔹 Obtener un evento por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Evento>> GetEvento(int id)
        {
            var evento = await _context.Eventos.FindAsync(id);
            if (evento == null) return NotFound();
            return evento;
        }

        // 🔹 Crear un nuevo evento
        [HttpPost("CrearEvento")]
        public async Task<ActionResult<Evento>> PostEvento(Evento evento)
        {
            evento.CreatedAt = DateTime.Now;
            evento.UpdatedAt = DateTime.Now;

            _context.Eventos.Add(evento);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEvento), new { id = evento.Id }, evento);
        }

        // 🔹 Editar un evento existente
        [HttpPut("EditarEvento/{id}")]
        public async Task<IActionResult> PutEvento(int id, Evento evento)
        {
            if (id != evento.Id) return BadRequest("ID del evento no coincide");

            // Mantener CreatedAt original
            var existingEvento = await _context.Eventos.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);
            if (existingEvento == null) return NotFound();

            evento.CreatedAt = existingEvento.CreatedAt;
            evento.UpdatedAt = DateTime.Now;

            _context.Entry(evento).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(evento);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventoExists(id)) return NotFound();
                else throw;
            }
        }

        // 🔹 Eliminar un evento
        [HttpDelete("EliminarEvento/{id}")]
        public async Task<IActionResult> DeleteEvento(int id)
        {
            var evento = await _context.Eventos.FindAsync(id);
            if (evento == null) return NotFound();

            _context.Eventos.Remove(evento);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 🔹 Función privada para verificar si el evento existe
        private bool EventoExists(int id)
        {
            return _context.Eventos.Any(e => e.Id == id);
        }
    }
}
