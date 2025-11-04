import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface GananciaZona {
  nombreZona: string;
  ganancias: number;
}

interface VendidoZona {
  nombreZona: string;
  vendido: number;
}

interface RendimientoEvento {
  nombreEvento: string;
  rendimiento: number;
}

interface ReporteData {
  fecha_ini: string;
  fecha_fin: string;
  gananciasZonas: GananciaZona[];
  vendidoZonas: VendidoZona[];
  rendimientoEvento: RendimientoEvento[];
}

const ReportPayments: React.FC = () => {
  const [data, setData] = useState<ReporteData | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const fetchReporte = async () => {
    try {
      const response = await fetch("https://localhost:7082/GenerarReporteGanancias");
      if (!response.ok) throw new Error("Error al obtener reporte");
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error("Error al traer el reporte:", error);
    }
  };

  const exportToPDF = async () => {
    if (!reportRef.current) return;
    const input = reportRef.current;

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("ReporteGanancias.pdf");
  };

  useEffect(() => {
    fetchReporte();
  }, []);

  const colors = {
    azul: "#0057b7",
    rojo: "#d62828",
    verde: "#2a9d8f",
    gris: "#f4f4f4",
  };

  if (!data)
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Cargando reporte...</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 3, backgroundColor: colors.gris }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" sx={{ color: colors.azul, fontWeight: "bold" }}>
          📘 Reporte de Ganancias
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={exportToPDF}
          sx={{ borderRadius: 2, fontWeight: "bold" }}
        >
          📄 Exportar PDF
        </Button>
      </Box>

      <Box ref={reportRef}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          📅 Período: {data.fecha_ini} → {data.fecha_fin}
        </Typography>

        <Grid container spacing={3}>
          {/* Ganancias por zona */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: colors.rojo, mb: 2 }}
                >
                  💰 Ganancias por zona
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.gananciasZonas}>
                    <XAxis dataKey="nombreZona" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ganancias" fill={colors.azul} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Vendidos por zona */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: colors.rojo, mb: 2 }}
                >
                  🎟️ Boletos vendidos por zona
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.vendidoZonas}>
                    <XAxis dataKey="nombreZona" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="vendido" fill={colors.verde} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Rendimiento por evento */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: colors.rojo, mb: 2 }}
                >
                  📊 Rendimiento por evento
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={data.rendimientoEvento}>
                    <XAxis dataKey="nombreEvento" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="rendimiento"
                      stroke={colors.azul}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ReportPayments;
