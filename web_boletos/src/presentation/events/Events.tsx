import React from "react";
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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const Events: React.FC = () => {
  // 🔹 Datos simulados (mock)
  const eventos = [
    {
      id: 1,
      nombre: "Final de Liga",
      descripcion: "Gran final del campeonato nacional de béisbol",
      fecha: "2025-10-15",
      hora: "18:30",
      imagen: "https://via.placeholder.com/100x70.png?text=Final",
    },
    {
      id: 2,
      nombre: "Amistoso Internacional",
      descripcion: "Partido amistoso entre equipos de diferentes países",
      fecha: "2025-11-05",
      hora: "20:00",
      imagen: "https://via.placeholder.com/100x70.png?text=Amistoso",
    },
    {
      id: 3,
      nombre: "Partido Local",
      descripcion: "Encuentro entre equipos de la liga local",
      fecha: "2025-12-01",
      hora: "17:00",
      imagen: "https://via.placeholder.com/100x70.png?text=Local",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📅 Listado de Eventos
      </Typography>

      {/* Buscador */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Buscar evento..."
            variant="outlined"
            size="small"
          />
        </Grid>
      </Grid>

      {/* Tabla de eventos */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
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
              {eventos.map((evento) => (
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
                    <IconButton color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Events;
