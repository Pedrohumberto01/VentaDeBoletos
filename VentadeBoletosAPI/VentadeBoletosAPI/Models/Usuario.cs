using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VentadeBoletosAPI.Models
{
    [Table("usuarios")]
    public class Usuario
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nombre")]
        [Required]
        public string Nombre { get; set; } = null!;

        [Column("cedula")]
        public string? Cedula { get; set; }

        [Column("email")]
        [Required]
        public string Email { get; set; } = null!;

        [Column("contrasenia")]
        [Required]
        public string Contrasenia { get; set; } = null!;

        [Column("rol")]
        [Required]
        public string Rol { get; set; } = "cliente";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        // Relaciones
        //public ICollection<Boleto>? Boletos { get; set; }
    }
}
