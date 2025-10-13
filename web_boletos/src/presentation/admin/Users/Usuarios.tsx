
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        👤 Listado de Usuarios
      </Typography>

      {/* Buscador y botón crear */}
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Buscar usuario..."
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
            Crear Usuario
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
