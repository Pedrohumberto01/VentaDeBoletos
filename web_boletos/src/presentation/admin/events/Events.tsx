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
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Crear Evento
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
