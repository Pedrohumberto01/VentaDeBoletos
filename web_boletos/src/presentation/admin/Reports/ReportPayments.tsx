import React, { useEffect, useState, useRef } from "react";
import Grid from "@mui/material/Grid";
import logo from "../../../assets/Logo.jpg";
import bgHeader from "../../../assets/estadio.webp";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
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
  const [fechaIni, setFechaIni] = useState("");
  const [fechaFin, setFechaFin] = useState("");

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

  const colors = {
    azul: "#0057b7",
    rojo: "#d62828",
    verde: "#2a9d8f",
    gris: "#f4f4f4",
    white: "ffffff",
  };

  const exportToPDF = async () => {
    if (!reportRef.current) return;

    // Función para convertir imagen a Base64
    const imageToBase64 = (img: HTMLImageElement): Promise<string> =>
      new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      });

    // Cargar logo
    const logoImg = new Image();
    logoImg.src = logo; // tu logo importado
    await new Promise((res) => (logoImg.onload = res));
    const logoBase64 = await imageToBase64(logoImg);

    // Cargar background del header
    const bgImg = new Image();
    bgImg.src = bgHeader;
    await new Promise((res) => (bgImg.onload = res));
    const bgBase64 = await imageToBase64(bgImg);

    // Capturar contenido principal
    const canvas = await html2canvas(reportRef.current, { scale: 1.5, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pdfWidth = pageWidth - 20;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    const headerHeight = 40;

    // Función para dibujar header con imagen de fondo
    const drawHeader = () => {
      // Fondo con imagen
      pdf.addImage(bgBase64, "PNG", 0, 0, pageWidth, headerHeight);

      // Logo a la izquierda
      pdf.addImage(logoBase64, "PNG", 10, 7, 45, 25);

      // Rectángulo semitransparente detrás del título para resaltar sobre la imagen
      const titleX = 65;
      pdf.setFillColor(0, 0, 0, 0.3); // negro semi-transparente

      // Título con sombra
      const title = "HomeRunStruck";
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(44);

      // Sombra
      pdf.setTextColor(0, 0, 0, 0.3);
      pdf.setLineWidth(1.5);
      pdf.text(title, titleX + 0.8, 22 + 0.8, { renderingMode: "stroke" });

      // Texto principal
      pdf.setTextColor(255, 255, 255);
      pdf.text(title, titleX, 22);

      // Línea separadora fina
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(0.5);
      pdf.line(10, headerHeight - 2, pageWidth - 10, headerHeight - 2);
    };

    drawHeader();

    let position = headerHeight + 5;
    const spacing = 10;
    const adjustedHeight = pdfHeight - spacing * 2;

    if (pdfHeight + headerHeight < pageHeight - 20) {
      pdf.addImage(imgData, "PNG", 10, position, pdfWidth, adjustedHeight);
    } else {
      let heightLeft = adjustedHeight;
      let contentPageHeight = pageHeight - headerHeight - 10;
      let y = position;

      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 10, y, pdfWidth, adjustedHeight);
        heightLeft -= contentPageHeight;
        if (heightLeft > 0) {
          pdf.addPage();
          drawHeader();
          y = headerHeight + 5;
        }
      }
    }

    pdf.save("ReporteGanancias.pdf");
  };



  useEffect(() => {
    fetchReporte();
    // 📆 Calcula el rango del último mes
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(hoy.getMonth() - 1);

    // 🕐 Formatea las fechas a yyyy-MM-dd (requerido por el input type="date")
    const formatearFecha = (fecha: Date) =>
      fecha.toISOString().split("T")[0];

    setFechaIni(formatearFecha(haceUnMes));
    setFechaFin(formatearFecha(hoy));
  }, []);

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
          📅 Período: 
        </Typography>
        <Box sx={{ display: "flex", gap: 5, mb: 5 }}>
      <TextField
        label="Fecha inicio"
        type="date"
        fullWidth
        sx={{ minWidth: "180px" }}
        InputLabelProps={{ shrink: true }}
        value={fechaIni}
        onChange={(e) => setFechaIni(e.target.value)}
      />
      <TextField
        label="Fecha fin"
        type="date"
        fullWidth
        sx={{ minWidth: "180px" }}
        InputLabelProps={{ shrink: true }}
        value={fechaFin}
        onChange={(e) => setFechaFin(e.target.value)}
      />
    </Box>

        <Grid container spacing={3}>
          {/* Ganancias por zona */}
           <Grid size={{ xs: 12, sm: 6 }}>
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
          <Grid size={{ xs: 12, sm: 6 }}>
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
          <Grid size={{ xs: 12 }}>
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
