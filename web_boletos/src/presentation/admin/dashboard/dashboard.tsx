import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar, XAxis, YAxis,
} from "recharts";

const Dashboard: React.FC = () => {
  const [eventosActivos, setEventosActivos] = React.useState<any[]>([]);
  const [asientos, setAsientos] = React.useState<any[]>([]);
  const [zonas, setZonas] = React.useState<any[]>([]);

  const ObtenerEventos = async () => {
    try {
      const response = await fetch("https://localhost:7082/api/Eventos/ObtenerEventos");
      if (!response.ok) throw new Error("Error al obtener eventos");
      const data = await response.json();
      setEventosActivos(data);
    } catch (err: any) {
      console.error("Error al obtener eventos:", err);
    }
  };

  const traerAsientos = async () => {
    try {
      const response = await fetch("https://localhost:7082/api/Asiento/ObtenerAsientos");
      const data = await response.json();
      setAsientos(data);
    } catch (error) {
      console.error("Error al traer asientos:", error);
    }
  };

  const traerZonas = async () => {
    try {
      const response = await fetch("https://localhost:7082/api/Zonas/ObtenerZonas");
      const data = await response.json();
      setZonas(data);
    } catch (error) {
      console.error("Error al traer zonas:", error);
    }
  };

  const calcularIngresos = () => {
    if (asientos.length === 0 || zonas.length === 0) return 0;

    // Filtra solo los asientos vendidos
    const asientosVendidos = asientos.filter(a => a.estado === "vendido");

    // Suma el precio de cada asiento según su zona
    const total = asientosVendidos.reduce((acc, asiento) => {
      const zona = zonas.find(z => z.id === asiento.zonaId);
      return acc + (zona ? zona.precio : 0);
    }, 0);

    return total;
  };

  const asientosVendidosPorZona = zonas.map(zona => {
    // Cuenta los asientos vendidos en esta zona
    const vendidos = asientos.filter(
      a => a.estado === "vendido" && a.zonaId === zona.id
    ).length;

    // Siempre retorna la zona, aunque vendidos sea 0
    return {
      name: zona.nombre,
      value: vendidos,
    };
  });



  React.useEffect(() => {
    ObtenerEventos();
    traerAsientos();
    traerZonas();
    calcularIngresos();
  }, []);

  const colors = {
    azul: "#0057b7",
    rojo: "#d62828",
    blanco: "#ffffff",
    verde: "#2a9d8f",
  };

  const boletosDisponibles = asientos.filter(a => a.estado === "disponible").length;
  const entradasVendidas = asientos.filter(a => a.estado === "vendido").length;
  const ingresos = calcularIngresos();

  const mockMetrics = [
    { title: "Entradas vendidas", value: entradasVendidas },
    { title: "Ingresos", value: `$${ingresos.toFixed(2)}` },
    { title: "Eventos activos", value: eventosActivos.length },
    { title: "Boletos disponibles", value: boletosDisponibles },
    { title: "Zonas Activas", value: zonas.length },
  ];

  const pieData = [
    { name: "Vendidos", value: entradasVendidas },
    { name: "Disponibles", value: boletosDisponibles },
  ];

  const pieColors = [colors.rojo, colors.verde];

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
        {/* Ventas PieChart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: colors.rojo }}>
                📈 Distribución de boletos
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Ventas por zona */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: colors.rojo }}>
                🏟️ Asientos vendidos por zona
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={asientosVendidosPorZona} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill={colors.azul} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;
