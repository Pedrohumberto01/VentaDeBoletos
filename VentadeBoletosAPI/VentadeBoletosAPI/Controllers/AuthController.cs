using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using VentadeBoletosAPI.Context;
using VentadeBoletosAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("VerificarCredenciales")]
    public async Task<ActionResult<string>> VerificarCredencialesAsync([FromBody] CredencialesRequest request)
    {
        try
        {
            var result = await _context.RolResult
                .FromSqlRaw(
                    "SELECT VerificarCredenciales(@email, @contrasenia) AS Rol",
                    new MySqlParameter("@email", request.Email),
                    new MySqlParameter("@contrasenia", request.Contrasenia)
                )
                .AsNoTracking()
                .FirstOrDefaultAsync();

            return Ok(result?.Rol ?? "no_existe");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error interno del servidor: {ex.Message}");
        }
    }
}

public class CredencialesRequest
{
    public string Email { get; set; }
    public string Contrasenia { get; set; }
}
