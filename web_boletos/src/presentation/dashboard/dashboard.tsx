import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Box,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 🎨 Colores del estadio
const colors = {
  azul: "#0057b7",
  rojo: "#d62828",
  blanco: "#ffffff",
};

const mockMetrics = [
  { title: "Entradas vendidas", value: "5,123" },
  { title: "Ingresos", value: "$12,400" },
  { title: "Eventos activos", value: "8" },
  { title: "Boletos disponibles", value: "3,200" },
];

const mockEvents = [
  {
    id: 1,
    nombre: "Inauguración temporada",
    fecha: "2025-03-15",
    hora: "20:00",
    descripcion: "Evento especial de inicio de temporada.",
    imagen: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    nombre: "Noche de luces",
    fecha: "2025-04-07",
    hora: "19:30",
    descripcion: "Show de luces en el Estadio Sur.",
    imagen: "https://via.placeholder.com/150",
  },
];

const salesData = [
  { name: "Lun", ventas: 400 },
  { name: "Mar", ventas: 300 },
  { name: "Mié", ventas: 500 },
  { name: "Jue", ventas: 700 },
  { name: "Vie", ventas: 800 },
  { name: "Sáb", ventas: 200 },
  { name: "Dom", ventas: 450 },
];

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ p: 3, backgroundColor: colors.blanco }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: colors.azul, fontWeight: "bold" }}
      >
        📊 Panel de control
      </Typography>

      {/* Métricas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {mockMetrics.map((metric, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ borderTop: `4px solid ${colors.rojo}` }}>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  {metric.title}
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: colors.azul }}>
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Próximos eventos */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ color: colors.rojo }}>
                  📅 Próximos eventos
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: colors.azul,
                    color: colors.blanco,
                    "&:hover": { backgroundColor: "#0041a8" },
                  }}
                  href="/events" // 👈 redirige a listar eventos
                >
                  Ver todos
                </Button>
              </Box>
              <Divider sx={{ my: 1 }} />
              {mockEvents.map((event) => (
                <Box key={event.id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: colors.azul }}>
                    {event.nombre}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {event.fecha} - {event.hora}
                  </Typography>
                  <Typography variant="body2">{event.descripcion}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Ventas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: colors.rojo }}>
                📈 Ventas esta semana
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={salesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ventas" fill={colors.azul} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Listado de eventos */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: colors.rojo }}>
                🟦 Listado de eventos
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" gap={2}>
                {mockEvents.map((event) => (
                  <Card
                    key={event.id}
                    sx={{
                      width: "45%",
                      cursor: "pointer",
                      border: `1px solid ${colors.azul}`,
                      "&:hover": { boxShadow: 4 },
                    }}
                    onClick={() => (window.location.href = "/events")} // 👈 lleva a lista
                  >
                    <CardContent>
                      <img
                        src={event.imagen}
                        alt={event.nombre}
                        style={{ width: "100%", borderRadius: "8px" }}
                      />
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: colors.azul }}>
                        {event.nombre}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Próximamente pagos */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: colors.rojo }}>
                💳 Pagos de boletos (próximamente)
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Aquí se mostrarán informes y gestión de pagos.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

