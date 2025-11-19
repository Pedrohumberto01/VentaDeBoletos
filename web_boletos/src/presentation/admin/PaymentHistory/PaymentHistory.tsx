import { useEffect, useState } from "react";
import logo from "../../../assets/Logo.jpg";
import bgHeader from "../../../assets/estadio.webp";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import autoTable from "jspdf-autotable";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
} from "@mui/material";
import QRCode from "react-qr-code";


interface Payment {
  id: number;
  pagoId: number;
  boletoId: number;
  codigoQR: string;
  numeroAsiento: string;
  fechaPago: string;
  idUsuario: number;
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const [back, setBack] = useState("#FFFFFF");
  const [fore, setFore] = useState("#000000");
  const [size, setSize] = useState(54);

  // 🔹 Obtener payments desde API
  const obtenerPayments = async () => {
    try {
      const response = await fetch("https://localhost:7082/ObtenerHistorialdePagos");
      if (!response.ok) throw new Error("Error al obtener payments");
      const data = await response.json();
      setPayments(data);
      console.log("Datos de payments:", data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPayments();
  }, []);

  const exportToExcel = async () => {
    if (payments.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Zonas");

    // ===== TÍTULO =====
    sheet.mergeCells("B1:E2"); // Deja espacio para logo en A1:A2
    const titleCell = sheet.getCell("B1");
    titleCell.value = "HomeRunStruck";
    titleCell.font = { size: 20, bold: true, color: { argb: "FFFFFFFF" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(1).height = 30;
    sheet.getRow(2).height = 25;

    // Aplicar fondo solo al rango del título
    ["B1", "C1", "B2", "C2" ].forEach((cellAddr) => {
      const cell = sheet.getCell(cellAddr);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF34495E" },
      };
    });

    sheet.getRow(1).height = 30;
    sheet.getRow(2).height = 25;


    // ===== LOGO =====
    sheet.addImage(workbook.addImage({
        buffer: await fetch(logo).then((r) => r.arrayBuffer()),
        extension: "png",
      }), {
      tl: { col: 0, row: 0 }, // esquina superior izquierda
      ext: { width: 80, height: 50 },
    });

    // ===== ENCABEZADO DE LA TABLA =====
    const headerRow = sheet.addRow(["ID de Pago", "ID de Boleto", "Código QR", "Número de Asiento", "Fecha de Pago"]);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.height = 20;

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2C3E50" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // ===== FILAS DE DATOS =====
    payments.forEach((p) => {
      const row = sheet.addRow([p.boletoId, p.boletoId || "-", p.codigoQR || "-", p.numeroAsiento || "-",  p.fechaPago || "-"]);
      row.alignment = { horizontal: "center", vertical: "middle" };
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // ===== Ajuste automático de columnas =====
    sheet.columns.forEach((col) => {
      let maxLength = 10;
      headerRow.eachCell?.((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
      col.width = maxLength + 5;
    });

    // ===== Logo =====
    sheet.addImage(workbook.addImage({
        buffer: await fetch(logo).then((r) => r.arrayBuffer()),
        extension: "png",
      }), {
      tl: { col: 0, row: 0 },
      ext: { width: 105, height: 55 },
    });

    // ===== Guardar archivo =====
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), "ReportePayments.xlsx");
  };

 const exportToPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    // === Convertir imágenes a Base64 ===
    const toBase64 = (src: string) =>
      new Promise<string>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
      });

    const logoBase64 = await toBase64(logo);
    const bgBase64 = await toBase64(bgHeader);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const headerHeight = 40;

    const drawHeader = () => {
      // Fondo con imagen
      pdf.addImage(bgBase64, "PNG", 0, 0, pageWidth, headerHeight);

      // Logo a la izquierda
      pdf.addImage(logoBase64, "PNG", 10, 7, 45, 25);

      // Rectángulo semitransparente detrás del título
      const titleX = 65;
      pdf.setFillColor(0, 0, 0, 0.3);

      // Título con sombra
      const title = "HomeRunStruck";
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(44);

      // Sombra con borde grueso
      pdf.setTextColor(0, 0, 0, 0.3);
      pdf.setLineWidth(1.5);
      pdf.text(title, titleX + 0.8, 22 + 0.8, { renderingMode: "stroke" });

      // Texto principal
      pdf.setTextColor(255, 255, 255);
      pdf.text(title, titleX, 22);

      // Línea separadora
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(0.5);
      pdf.line(10, headerHeight - 2, pageWidth - 10, headerHeight - 2);
    };

    // Dibujar header en página 1
    drawHeader();

    // ============================
    // TABLA
    // ============================
    autoTable(pdf, {
      startY: headerHeight + 8, // justo debajo del header
      head: [["ID de Pago", "ID de Boleto", "Código QR", "Número de Asiento", "Fecha de Pago"]],
      body: payments.map((p) => [
        p.pagoId,
        p.boletoId || "-",
        p.codigoQR,
        p.numeroAsiento,
        p.fechaPago
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [30, 30, 30],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didDrawPage: (data) => {
        if (data.pageNumber > 1) {
          drawHeader();
        }
      },
    });

    pdf.save("ReportePayments.pdf");
  };

  // 🔹 Filtrado de pagos
  const filteredPayments = payments.filter((p) =>
    p.id.toString().includes(search.toLowerCase()) ||
    p.numeroAsiento.toLowerCase().includes(search.toLowerCase()) ||
    p.fechaPago.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Datos paginados
  const paginatedPayments = filteredPayments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // 🔹 Cambiar página
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // 🔹 Cambiar cantidad de filas
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          🏟️ Listado de Pagos
        </Typography>

        <Box  sx={{ display: "flex", gap: 2, mb: 2, }}>
        {/* 🔍 Filtro */}
        <TextField
          label="Buscar pago..."
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por ID, asiento o fecha..."
          sx={{ flex: 1 }}
        />

        <Button
          variant="contained"
          color="error"
          onClick={exportToPDF}
          sx={{ borderRadius: 2, fontWeight: "bold", whiteSpace: "nowrap" }}
        >
          📄 Exportar PDF
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={exportToExcel}
          sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
        >
          📊 Exportar Excel
        </Button>
      </Box>

      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          {loading ? (
            <Typography>Historial de pagos...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>ID de Pago</TableCell>
                    <TableCell>ID de Boleto</TableCell>
                    <TableCell>Código QR</TableCell>
                    <TableCell>Número de Asiento</TableCell>
                    <TableCell align="center">Fecha de Pago</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPayments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>{p.pagoId}</TableCell>
                      <TableCell>{p.boletoId}</TableCell>
                      <TableCell>
                        <QRCode
                          title="QRCode"
                          value={
                            "https://localhost:7082/client/pago_exitoso?id=" +
                            p.pagoId +
                            "Codigo absoluto=" +
                            p.codigoQR +
                            "&BoletoId=" +
                            p.boletoId +
                            "&NumeroAsiento=" +
                            p.numeroAsiento +
                            "&FechaPago=" +
                            p.fechaPago +
                            "&idUsuario=" +
                            p.idUsuario
                          }
                          bgColor={back}
                          fgColor={fore}
                          size={size === 1 ? 0 : size}
                        />
                      </TableCell>
                      <TableCell>{p.numeroAsiento}</TableCell>
                      <TableCell align="center">{p.fechaPago}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 🔹 Paginación */}
              <TablePagination
                component="div"
                count={filteredPayments.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página"
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentHistory;
