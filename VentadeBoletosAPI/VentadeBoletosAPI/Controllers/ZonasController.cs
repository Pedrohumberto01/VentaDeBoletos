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

        [HttpGet("ObtenerZonas")]
        public async Task<ActionResult<IEnumerable<Zona>>> GetZonas()
        {
            return await _context.Zonas.ToListAsync();
        }

        [HttpPost("CrearZona")]
        public async Task<ActionResult<Zona>> PostZonas(Zona zona)
        {
            _context.Zonas.Add(zona);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetZonas), new { id = zona.Id }, zona);
        }
    }
}
