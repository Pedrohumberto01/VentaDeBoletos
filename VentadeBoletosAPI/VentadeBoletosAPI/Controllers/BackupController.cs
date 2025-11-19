using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using System.Diagnostics;
using VentadeBoletosAPI.Context;

[ApiController]
[Route("api/[controller]")]
public class BackupController : ControllerBase
{
    private readonly AppDbContext _context;

    private readonly string _user;
    private readonly string _password;
    private readonly string _database;

    public BackupController(AppDbContext context)
    {
        _context = context;

        var conn = context.Database.GetDbConnection();

        var builder = new MySqlConnectionStringBuilder(conn.ConnectionString);
        _user = builder.UserID;
        _password = builder.Password;
        _database = builder.Database;
    }

    [HttpGet("backup")]
    public IActionResult Backup()
    {
        string fileName = $"BackupBoleteria_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.sql";
        string filePath = Path.Combine(Path.GetTempPath(), fileName);

        string mysqldump = @"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe";
        string args = $"-u {_user} -p{_password} {_database} --result-file=\"{filePath}\"";

        var psi = new ProcessStartInfo
        {
            FileName = mysqldump,
            Arguments = args,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        using var process = Process.Start(psi)!;
        string error = process.StandardError.ReadToEnd();
        process.WaitForExit();

        if (process.ExitCode != 0)
            return StatusCode(500, $"Error al generar backup: {error}");

        return PhysicalFile(filePath, "application/sql", fileName);
    }

    [HttpPost("restauracion")]
    public async Task<IActionResult> RestoreDB(IFormFile file)
    {
        if(file == null || file.Length == 0)
        return BadRequest("Debe seleccionar un archivo .sql");

        // Carpeta temporal
        string tempFolder = Path.Combine(Path.GetTempPath(), "DbRestores");
        if (!Directory.Exists(tempFolder))
            Directory.CreateDirectory(tempFolder);

        string tempFilePath = Path.Combine(tempFolder, $"{Guid.NewGuid()}.sql");

        // Guardar archivo en disco
        using (var stream = new FileStream(tempFilePath, FileMode.Create))
            await file.CopyToAsync(stream);

        try
        {
            string mysql = @"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe";

            // Ejecutar comando vía cmd con redirección de archivo
            var psi = new ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = $"/c \"\"{mysql}\" -u {_user} -p{_password} {_database} < \"{tempFilePath}\"\"",
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = Process.Start(psi)!;
            string error = process.StandardError.ReadToEnd();
            process.WaitForExit();

            if (process.ExitCode != 0)
                return StatusCode(500, $"Error restaurando BD: {error}");

            return Ok("Restauración completada con éxito.");
        }
        finally
        {
            if (System.IO.File.Exists(tempFilePath))
                System.IO.File.Delete(tempFilePath);
        }
    }
}
