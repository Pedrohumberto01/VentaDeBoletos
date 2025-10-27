import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PagoBoletos() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventoId, zona, boletos, zonaId, usuarioId, precio } = location.state || {};

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const crearSesionStripe = async () => {
      try {
        if (!boletos || boletos.length === 0) {
          alert("No hay boletos seleccionados 😅");
          navigate(-1);
          return;
        }

        // Llamada al backend para crear sesión de pago
        const response = await fetch("https://localhost:7082/api/Payment/crear-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            boletosIds: boletos,
            metodoPago: "tarjeta",
            monto: boletos.length * precio, // Ejemplo: $10 por boleto
            estadoPago: "pendiente",
            usuarioId: usuarioId || 1,
            eventoId: eventoId,
            zonaId: zonaId || 1,
          }),
        });

        if (!response.ok) throw new Error("Error al crear la sesión de pago");

        const data = await response.json();

        if (data.url) {
          window.location.href = data.url; // Redirige a Stripe 💳
        } else {
          alert("No se pudo obtener la URL de pago.");
          navigate(-1);
        }
      } catch (error) {
        console.error("❌ Error al procesar el pago:", error);
        alert("Ocurrió un error al procesar el pago.");
        navigate(-1);
      } finally {
        setCargando(false);
      }
    };

    crearSesionStripe();
  }, [boletos, eventoId, zonaId, usuarioId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
      {cargando ? (
        <>
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            🔄 Redirigiendo al portal de pago...
          </h2>
          <p className="text-gray-600">Por favor, espera un momento.</p>
        </>
      ) : (
        <h2 className="text-xl text-gray-700">Preparando tu pago...</h2>
      )}
    </div>
  );
}
