using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VentadeBoletosAPI.Context;
using VentadeBoletosAPI.Models;
using static VentadeBoletosAPI.Controllers.PaymentHistoryController;

namespace VentadeBoletosAPI.Controllers
{
    public class ReportController : Controller
    {

        private readonly AppDbContext _context;

        public ReportController(AppDbContext context) { 
            _context = context;
        }


        public class GananciasZonas
        {
            public string? nombreZona { get; set; }
            public float? ganancias { get; set; }
        }

        public class VendidoZonas
        {
            public string? nombreZona { get; set; }
            public float? vendido { get; set; }
        }

        public class RendimientoEvento
        {
            public string? nombreEvento { get; set; }
            public float? rendimiento { get; set; }
        }

        public class ReporteGanancias
        {
            // fecha ini, fecha fin, ganancias x zona, vendido px zona, rendimiento evento
            // Se agregaran las fechas de las ultimas 4 semanas, se es que estan disponibles
            
            public string? fecha_ini {  get; set; } 
            public string? fecha_fin { get; set; }
            public GananciasZonas[]? gananciasZonas { get; set; }
            public VendidoZonas[]? vendidoZonas { get; set; }
            public RendimientoEvento[]? rendimientoEvento { get; set; }


        }



        [HttpGet("GenerarReporteGanancias")]
        public async Task<ActionResult<ReporteGanancias>> GenerarReporteGanancias()
        {
            var fechaIni = DateTime.UtcNow.AddDays(-30).ToString("yyyy-MM-dd");
            var fechaFin = DateTime.UtcNow.ToString("yyyy-MM-dd");

            // 1. Ganancias por zona
            var gananciasPZonas = await _context.Zonas
                .Select(z => new GananciasZonas
                {
                    nombreZona = z.Nombre,
                    ganancias = (float)(
                        (from b in _context.Boletos
                         join pb in _context.PagoBoletos on b.Id equals pb.BoletoId into boletoPagos
                         from pb in boletoPagos.DefaultIfEmpty()
                         join p in _context.Pagos on pb.PagoId equals p.Id into pagoJoin
                         from p in pagoJoin.DefaultIfEmpty()
                         where b.ZonaId == z.Id
                         select (decimal?)b.Precio
                        ).Sum() ?? 0m
                    )
                })
                .OrderBy(g => g.nombreZona)
                .ToListAsync();


            // 2. Boletos vendidos por zona
            var vendidosPZonas = await _context.Zonas
                .Select(z => new VendidoZonas
                {
                    nombreZona = z.Nombre,
                    vendido = (float)(
                        (from b in _context.Boletos
                         join pb in _context.PagoBoletos on b.Id equals pb.BoletoId into boletoPagos
                         from pb in boletoPagos.DefaultIfEmpty()
                         join p in _context.Pagos on pb.PagoId equals p.Id into pagoJoin
                         from p in pagoJoin.DefaultIfEmpty()
                         where b.ZonaId == z.Id
                         select b.Id
                        ).Count()
                    )
                })
                .OrderBy(v => v.nombreZona)
                .ToListAsync();


            // 3. Rendimiento por evento
            var rendimientoEventos = await _context.Eventos
                .Select(e => new RendimientoEvento
                {
                    nombreEvento = e.Nombre,
                    rendimiento = (float)(
                        (
                            (from pb in _context.PagoBoletos
                             join p in _context.Pagos on pb.PagoId equals p.Id
                             join b in _context.Boletos on pb.BoletoId equals b.Id
                             where b.EventoId == e.Id
                             select b.Id
                            ).Count()
                            /   
                            (float)(_context.Zonas.Sum(z => z.Capacidad) == 0 ? 1 : _context.Zonas.Sum(z => z.Capacidad))
                        ) * 1000
                    )
                })
                .ToListAsync();

            // 4. Construcción del reporte final
            var reporte = new ReporteGanancias
            {
                fecha_ini = fechaIni,
                fecha_fin = fechaFin,
                gananciasZonas = gananciasPZonas.ToArray(),
                vendidoZonas = vendidosPZonas.ToArray(),
                rendimientoEvento = rendimientoEventos.ToArray()
            };

            return Ok(reporte);
        }



    }
}
