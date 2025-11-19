import logo from "../../../assets/Logo.jpg";
import bgHeader from "../../../assets/estadio.webp";
import autoTable from "jspdf-autotable";
import React, { useState, useEffect } from "react";
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
import jsPDF from "jspdf";

interface Usuario {
  id: number;
  nombre: string;
  cedula?: string;
  email: string;
  contrasenia: string;
  rol: string;
  createdAt?: string;
  updatedAt?: string;
}

const UsuarioComponent: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState<Partial<Usuario> | null>(null);

  // 🔹 Obtener usuarios desde API
  const obtenerUsuarios = async () => {
    try {
      const response = await fetch("https://localhost:7082/api/Usuarios/ObtenerTodosUsuarios");
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    if (usuarios.length === 0) return;

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
    const headerRow = sheet.addRow(["Nombre", "Cedula", "Email", "Rol"]);
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
    usuarios.forEach((u) => {
      const row = sheet.addRow([u.nombre, u.cedula || "-", u.email || "-",  u.rol || "-",]);
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
      head: [["Nombre", "Cédula", "Email", "Rol"]],
      body: usuarios.map((u) => [
        u.nombre,
        u.cedula || "-",
        u.email,
        u.rol
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

    pdf.save("ReporteUsuarios.pdf");
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // 🔹 Abrir modal crear/editar
  const handleOpenDialog = (usuario?: Usuario) => {
    setCurrentUsuario(usuario || { rol: "cliente" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setCurrentUsuario(null);
    setOpenDialog(false);
  };

  // 🔹 Guardar usuario (crear o editar)
  const handleSaveUsuario = async () => {
    if (!currentUsuario) return;

    try {
      const method = currentUsuario.id ? "PUT" : "POST";
      const url = currentUsuario.id
        ? `https://localhost:7082/api/Usuarios/EditarUsuario/${currentUsuario.id}`
        : "https://localhost:7082/api/Usuarios/CrearUsuario";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUsuario),
      });

      if (!response.ok) throw new Error("Error al guardar usuario");

      await obtenerUsuarios();
      handleCloseDialog();
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // 🔹 Eliminar usuario
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      const response = await fetch(`https://localhost:7082/api/Usuarios/EliminarUsuario/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar usuario");
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // 🔹 Filtrado de usuarios
  const filteredUsuarios = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }} >
      <Typography variant="h4" gutterBottom>
        👤 Listado de Usuarios
      </Typography>
    

      {/* Buscador y botón crear */}
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid size={{xs:12, sm:6, md:4 }}>
          <TextField
            fullWidth
            label="Buscar usuario..."
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
            Crear Usuario
          </Button>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            color="error"
            onClick={exportToPDF}
            sx={{ fontWeight: "bold" }}
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

      {/* Tabla de usuarios */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          {loading ? (
            <Typography>Cargando usuarios...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Cédula</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.nombre}</TableCell>
                    <TableCell>{usuario.cedula || "-"}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.rol}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpenDialog(usuario)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(usuario.id)}>
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
        <DialogTitle>{currentUsuario?.id ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            fullWidth
            value={currentUsuario?.nombre || ""}
            onChange={(e) =>
              setCurrentUsuario({ ...currentUsuario, nombre: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Cédula"
            fullWidth
            value={currentUsuario?.cedula || ""}
            onChange={(e) =>
              setCurrentUsuario({ ...currentUsuario, cedula: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={currentUsuario?.email || ""}
            onChange={(e) =>
              setCurrentUsuario({ ...currentUsuario, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Contraseña"
            type="password"
            fullWidth
            value={currentUsuario?.contrasenia || ""}
            onChange={(e) =>
              setCurrentUsuario({ ...currentUsuario, contrasenia: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Rol"
            select
            fullWidth
            value={currentUsuario?.rol || "cliente"}
            onChange={(e) =>
              setCurrentUsuario({ ...currentUsuario, rol: e.target.value })
            }
          >
            <MenuItem value="cliente">cliente</MenuItem>
            <MenuItem value="admin">admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveUsuario}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsuarioComponent;
