import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


export default function PagoBoletosEfectivo() {
  const navigate = useNavigate();
  const location = useLocation();
 
    const handlePago = async () => {
        const payload = {
            usuarioId: 1, 
            eventoId,
            zonaId,
            asientosSeleccionados,
            precioAsiento,
            total,
        };

        try {
            const res = await fetch("https://localhost:7082/api/Boleto/Generar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Error al generar boletos");

            const data = await res.json();
            console.log("✅ Boletos generados:", data.boletos);

            alert("Boletos generados exitosamente 🎟️");
            navigate("/confirmacion", { state: { boletos: data.boletos } });
        } catch (err) {
            console.error(err);
            alert("❌ No se pudieron generar los boletos");
        }
    };


  // Datos recibidos desde la vista anterior
  const { asientosSeleccionados, zonaId, eventoId } =
    (location.state as {
      asientosSeleccionados: number[];
      zonaId: number;
      eventoId: number;
    }) || {};

  const [zona, setZona] = useState<any>(null);
  const [evento, setEvento] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar datos de la zona y evento
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zonaRes, eventoRes] = await Promise.all([
          fetch(`https://localhost:7082/api/Zonas/ObtenerZonas`),
          fetch(`https://localhost:7082/api/Eventos/ObtenerEventos`),
        ]);

        const zonasData = await zonaRes.json();
        const eventosData = await eventoRes.json();

        const zonaSeleccionada = zonasData.find((z: any) => z.id === zonaId);
        const eventoSeleccionado = eventosData.find((e: any) => e.id === eventoId);

        setZona(zonaSeleccionada);
        setEvento(eventoSeleccionado);
      } catch (error) {
        console.error("Error al cargar zona/evento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [zonaId, eventoId]);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  if (!zona || !evento) {
    return (
      <Box className="text-center mt-10 text-red-600">
        <Typography variant="h6">
          ⚠️ No se encontraron datos del evento o zona.
        </Typography>
      </Box>
    );
  }

  const total = asientosSeleccionados.length * zona.precio;
  const precioAsiento = zona.precio;
  return (
    <Box sx={{ p: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Volver
      </Button>

      <Card sx={{ boxShadow: 3, maxWidth: 700, mx: "auto" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom textAlign="center" color="primary">
            💳 Pago de Boletos
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Información del evento */}
          <Typography variant="h6" color="text.secondary" gutterBottom>
            🎫 Evento:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {evento.nombre} <br />
            <strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString()}{" "}
            <br />
            <strong>Hora:</strong> {evento.hora}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Información de la zona */}
          <Typography variant="h6" color="text.secondary" gutterBottom>
            🏟️ Zona:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {zona.nombre} — <strong>${zona.precio}</strong> por boleto
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Asientos seleccionados */}
          <Typography variant="h6" color="text.secondary" gutterBottom>
            🪑 Asientos seleccionados:
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 2,
            }}
          >
            {asientosSeleccionados.map((id) => (
              <Box
                key={id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  backgroundColor: "#e0f2fe",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                <EventSeatIcon color="primary" />
                <Typography variant="body2">Asiento #{id}</Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Total a pagar */}
          <Typography variant="h6" textAlign="center" gutterBottom>
            💰 Total a pagar:{" "}
            <span style={{ color: "#2563eb", fontWeight: "bold" }}>
              ${total.toFixed(2)}
            </span>
          </Typography>

          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                // Aquí luego conectas tu flujo de pago
                console.log({
                  zonaId,
                  eventoId,
                  asientosSeleccionados,
                  precioAsiento,
                  total,
                });
                handlePago();
                alert("Pago iniciado...");
              }}
            >
              Proceder al Pago
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  
}


