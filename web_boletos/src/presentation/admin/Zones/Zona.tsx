import React, { useState, useEffect } from "react";
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
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Buscar zona..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Crear Zona
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
