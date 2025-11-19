import React, { useState, useEffect } from "react";
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
  IconButton,
  TextField,
  Avatar,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

interface Evento {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  hora: string;
  imagen: string;
}

const Events: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvento, setCurrentEvento] = useState<Partial<Evento> | null>(null);

  // 🔹 Función para obtener eventos desde la API
  const ObtenerEventos = async () => {
    try {
      const response = await fetch("https://localhost:7082/api/Eventos/ObtenerEventos");
      if (!response.ok) throw new Error("Error al obtener eventos");
      const data = await response.json();
      setEventos(data);
    } catch (err: any) {
      console.error("Error al obtener eventos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ObtenerEventos();
  }, []);

  const exportToExcel = async () => {
    if (eventos.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Zonas");

    // ===== TÍTULO =====
    sheet.mergeCells("B1:D2"); // Deja espacio para logo en A1:A2
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
    const headerRow = sheet.addRow(["Nombre", "Descripción", "Fecha", "Hora"]);
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
    eventos.forEach((e) => {
      const row = sheet.addRow([e.nombre || "-", e.descripcion || "-", e.fecha || "-",  e.hora || "-"]);
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
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), "ReporteEventos.xlsx");
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
        head: [["Nombre", "Descripción", "Fecha", "Hora"]],
        body: eventos.map((e) => [
          e.nombre,
          e.descripcion || "-",
          e.fecha,
          e.hora,
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
  
      pdf.save("ReporteEventos.pdf");
    };

  // 🔹 Función para abrir el modal de crear/editar
  const handleOpenDialog = (evento?: Evento) => {
    setCurrentEvento(evento || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setCurrentEvento(null);
    setOpenDialog(false);
  };

  // 🔹 Guardar evento (crear o editar)
  const handleSaveEvento = async () => {
    if (!currentEvento) return;

    try {
      const method = currentEvento.id ? "PUT" : "POST";
      const url = currentEvento.id
        ? `https://localhost:7082/api/Eventos/EditarEvento/${currentEvento.id}`
        : "https://localhost:7082/api/Eventos/CrearEvento";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentEvento),
      });

      if (!response.ok) throw new Error("Error al guardar evento");

      await ObtenerEventos();
      handleCloseDialog();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // 🔹 Eliminar evento
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este evento?")) return;
    try {
      const response = await fetch(`https://localhost:7082/api/Eventos/EliminarEvento/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar evento");
      setEventos((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // 🔹 Filtrado de eventos
  const filteredEventos = eventos.filter((e) =>
    e.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📅 Listado de Eventos
      </Typography>

      {/* Buscador y botón crear */}
      <Grid container spacing={2} mb={2} alignItems="center">
          <Grid>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Crear Evento
            </Button>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              color="success"
              onClick={exportToExcel}
              sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
            >
              📊 Exportar Excel
            </Button>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              color="error"
              onClick={exportToPDF}
              sx={{ borderRadius: 2, fontWeight: "bold", whiteSpace: "nowrap" }}
            >
              📄 Exportar PDF
            </Button>
          </Grid>
        </Grid>

      {/* Tabla de eventos */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          {loading ? (
            <Typography>Cargando eventos...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Imagen</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEventos.map((evento) => (
                  <TableRow key={evento.id}>
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={evento.imagen}
                        alt={evento.nombre}
                        sx={{ width: 80, height: 50 }}
                      />
                    </TableCell>
                    <TableCell>{evento.nombre}</TableCell>
                    <TableCell>{evento.descripcion}</TableCell>
                    <TableCell>{evento.fecha}</TableCell>
                    <TableCell>{evento.hora}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpenDialog(evento)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(evento.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal Crear/Editar */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{currentEvento?.id ? "Editar Evento" : "Crear Evento"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            fullWidth
            value={currentEvento?.nombre || ""}
            onChange={(e) =>
              setCurrentEvento({ ...currentEvento, nombre: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={currentEvento?.descripcion || ""}
            onChange={(e) =>
              setCurrentEvento({ ...currentEvento, descripcion: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Fecha"
            type="date"
            fullWidth
            value={currentEvento?.fecha || ""}
            onChange={(e) =>
              setCurrentEvento({ ...currentEvento, fecha: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Hora"
            type="time"
            fullWidth
            value={currentEvento?.hora || ""}
            onChange={(e) =>
              setCurrentEvento({ ...currentEvento, hora: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Imagen (URL)"
            fullWidth
            value={currentEvento?.imagen || ""}
            onChange={(e) =>
              setCurrentEvento({ ...currentEvento, imagen: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveEvento}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Events;
