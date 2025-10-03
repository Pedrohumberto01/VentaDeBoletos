using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VentadeBoletosAPI.Context;

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
    public async Task<int> VerificarCredencialesAsync(string email, string contrasenia)
    {
        var result = await _context.Usuarios
            .FromSqlInterpolated($"SELECT VerificarCredenciales({email}, {contrasenia}) as Id")
            .Select(u => u.Id)
            .FirstOrDefaultAsync();

        return result;
    }

}
