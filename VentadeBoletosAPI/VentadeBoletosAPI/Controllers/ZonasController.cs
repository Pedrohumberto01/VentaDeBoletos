using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VentadeBoletosAPI.Context;
using VentadeBoletosAPI.Models;

namespace VentadeBoletosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ZonasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ZonasController(AppDbContext context)
        {
            _context = context;
        }

        // 🔹 Obtener todas las zonas
        [HttpGet("ObtenerZonas")]
        public async Task<ActionResult<IEnumerable<Zona>>> GetZonas()
        {
            return await _context.Zonas.ToListAsync();
        }

        // 🔹 Obtener una zona por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Zona>> GetZona(int id)
        {
            var zona = await _context.Zonas.FindAsync(id);
            if (zona == null) return NotFound();
            return zona;
        }

        // 🔹 Crear una nueva zona
        [HttpPost("CrearZona")]
        public async Task<ActionResult<Zona>> PostZona(Zona zona)
        {
            zona.CreatedAt = DateTime.Now;
            zona.UpdatedAt = DateTime.Now;

            _context.Zonas.Add(zona);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetZona), new { id = zona.Id }, zona);
        }

        // 🔹 Editar zona existente
        [HttpPut("EditarZona/{id}")]
        public async Task<IActionResult> PutZona(int id, Zona zona)
        {
            if (id != zona.Id) return BadRequest("ID de zona no coincide");

            var existingZona = await _context.Zonas.AsNoTracking().FirstOrDefaultAsync(z => z.Id == id);
            if (existingZona == null) return NotFound();

            zona.CreatedAt = existingZona.CreatedAt;
            zona.UpdatedAt = DateTime.Now;

            _context.Entry(zona).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(zona);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ZonaExists(id)) return NotFound();
                else throw;
            }
        }

        // 🔹 Eliminar zona
        [HttpDelete("EliminarZona/{id}")]
        public async Task<IActionResult> DeleteZona(int id)
        {
            var zona = await _context.Zonas.FindAsync(id);
            if (zona == null) return NotFound();

            _context.Zonas.Remove(zona);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 🔹 Función privada para verificar si la zona existe
        private bool ZonaExists(int id)
        {
            return _context.Zonas.Any(z => z.Id == id);
        }
    }
}
