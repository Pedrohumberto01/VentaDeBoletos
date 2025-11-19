import React, { useState, useEffect } from "react";
import logo from "../../../assets/Logo.jpg";
import bgHeader from "../../../assets/estadio.webp";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
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
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import autoTable from "jspdf-autotable";

interface Zona {
  id: number;
  nombre: string;
  capacidad: number;
  precio: number;
  createdAt?: string;
  updatedAt?: string;
}

const ZonasComponent: React.FC = () => {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentZona, setCurrentZona] = useState<Partial<Zona> | null>(null);

  // 🔹 Obtener zonas desde API
  const obtenerZonas = async () => {
    try {
      const response = await fetch("https://localhost:7082/api/Zonas/ObtenerZonas");
      if (!response.ok) throw new Error("Error al obtener zonas");
      const data = await response.json();
      setZonas(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    if (zonas.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Zonas");

    // ===== TÍTULO =====
    sheet.mergeCells("B1:C2"); // Deja espacio para logo en A1:A2
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
    const headerRow = sheet.addRow(["Nombre", "Capacidad", "Precio"]);
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
    zonas.forEach((z) => {
      const row = sheet.addRow([z.nombre, z.capacidad || "-", z.precio]);
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
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), "ReporteZonas.xlsx");
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
      head: [["Nombre de la zona", "Capacidad", "Precio"]],
      body: zonas.map((z) => [
        z.nombre,
        z.capacidad || "-",
        z.precio,
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
  
    pdf.save("ReporteZonas.pdf");
  };

  useEffect(() => {
    obtenerZonas();
  }, []);

  // 🔹 Abrir modal crear/editar
  const handleOpenDialog = (zona?: Zona) => {
    setCurrentZona(zona || {});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setCurrentZona(null);
    setOpenDialog(false);
  };

  // 🔹 Guardar zona (crear o editar)
  const handleSaveZona = async () => {
    if (!currentZona) return;

    try {
      const method = currentZona.id ? "PUT" : "POST";
      const url = currentZona.id
        ? `https://localhost:7082/api/Zonas/EditarZona/${currentZona.id}`
        : "https://localhost:7082/api/Zonas/CrearZona";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentZona),
      });

      if (!response.ok) throw new Error("Error al guardar zona");

      await obtenerZonas();
      handleCloseDialog();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // 🔹 Eliminar zona
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta zona?")) return;
    try {
      const response = await fetch(`https://localhost:7082/api/Zonas/EliminarZona/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar zona");
      setZonas((prev) => prev.filter((z) => z.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // 🔹 Filtrado de zonas
  const filteredZonas = zonas.filter((z) =>
    z.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🏟️ Listado de Zonas
      </Typography>

      {/* Buscador y botón crear */}
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid size={{ xs:12, sm:6, md:4 }}>
          <TextField
            fullWidth
            label="Buscar zona..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Crear Zona
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            color="error"
            onClick={exportToPDF}
            sx={{ borderRadius: 2, fontWeight: "bold" }}
          >
            📄 Exportar PDF
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            color="success"
            onClick={exportToExcel}
            sx={{ fontWeight: "bold" }}
          >
            📊 Exportar Excel
          </Button>
        </Grid>
      </Grid>

      {/* Tabla de zonas */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          {loading ? (
            <Typography>Cargando zonas...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Capacidad</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredZonas.map((zona) => (
                  <TableRow key={zona.id}>
                    <TableCell>{zona.nombre}</TableCell>
                    <TableCell>{zona.capacidad}</TableCell>
                    <TableCell>{zona.precio}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpenDialog(zona)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(zona.id)}>
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
        <DialogTitle>{currentZona?.id ? "Editar Zona" : "Crear Zona"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            fullWidth
            value={currentZona?.nombre || ""}
            onChange={(e) =>
              setCurrentZona({ ...currentZona, nombre: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Capacidad"
            type="number"
            fullWidth
            value={currentZona?.capacidad || 0}
            onChange={(e) =>
              setCurrentZona({ ...currentZona, capacidad: Number(e.target.value) })
            }
          />
          <TextField
            margin="dense"
            label="Precio"
            type="number"
            fullWidth
            value={currentZona?.precio || 0}
            onChange={(e) =>
              setCurrentZona({ ...currentZona, precio: Number(e.target.value) })
            }
          />
          <TextField
            select
            margin="dense"
            label="Estado"
            fullWidth
            defaultValue="Habilitado"
          >
            <MenuItem value="Habilitado">Habilitado</MenuItem>
            <MenuItem value="Deshabilitado">Deshabilitado</MenuItem>
          </TextField>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveZona}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ZonasComponent;
