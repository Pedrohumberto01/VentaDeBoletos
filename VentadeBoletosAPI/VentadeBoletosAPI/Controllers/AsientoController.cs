using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VentadeBoletosAPI.Context;
using VentadeBoletosAPI.Models;

namespace VentadeBoletosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AsientoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AsientoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("ObtenerAsientos")]
        public async Task<ActionResult<IEnumerable<Asiento>>> GetAsientos()
        {
            return await _context.Asientos.ToListAsync();
        }

        [HttpGet("ObtenerAsientosPorZona/{zonaId}")]
        public async Task<ActionResult<IEnumerable<Asiento>>> GetAsientosPorZona(int zonaId)
        {
            var asientos = await _context.Asientos
                .Where(a => a.ZonaId == zonaId)
                .ToListAsync();

            if (asientos == null || asientos.Count == 0)
            {
                return NotFound($"No se encontraron asientos para la zona con ID {zonaId}.");
            }

            return Ok(asientos);
        }

        [HttpPut("CambiarEstado/{id}")]
        public async Task<IActionResult> PutAsiento(int id, Asiento asiento)
        {
            if (id != asiento.Id) return BadRequest();
            _context.Entry(asiento).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
