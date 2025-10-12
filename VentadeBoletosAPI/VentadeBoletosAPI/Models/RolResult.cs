using Microsoft.EntityFrameworkCore;

namespace VentadeBoletosAPI.Models
{
    [Keyless] // 👈 importante
    public class RolResult
    {
        public string Rol { get; set; }
    }
}
