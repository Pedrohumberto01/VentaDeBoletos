import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BitMap from "../../../assets/bitmap.png";
import EventSeatIcon from "@mui/icons-material/EventSeat";

export default function VenderManualmente() {
  const [eventosActivos, setEventosActivos] = useState<any[]>([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<string>("");
  const [zonas, setZonas] = useState<any[]>([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string>("");
  const [asientos, setAsientos] = useState<any[]>([]);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<number[]>([]);
  const navigate = useNavigate();

  
  // 🔹 Obtener eventos
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

  // 🔹 Traer zonas desde la API
  const traerZonas = async () => {
    try {
      const response = await fetch("https://localhost:7082/api/Zonas/ObtenerZonas");
      const data = await response.json();
      setZonas(data);
    } catch (error) {
      console.error("Error al traer zonas:", error);
    }
  };

  // 🔹 Traer asientos desde la API
  const traerAsientos = async () => {
    try {
      const response = await fetch("https://localhost:7082/api/Asiento/ObtenerAsientos");
      const data = await response.json();
      setAsientos(data);
    } catch (error) {
      console.error("Error al traer asientos:", error);
    }
  };

  // 🔹 Cargar datos al inicio
  useEffect(() => {
    ObtenerEventos();
    traerZonas();
    traerAsientos();
  }, []);

  // 🔹 Filtrar asientos por zona y evento
  const asientosZona = zonaSeleccionada
    ? asientos.filter(
        (a) =>
          a.zonaId === parseInt(zonaSeleccionada)
      )
    : [];

  // 🔹 Alternar selección de asiento
  const toggleAsiento = (idAsiento: number, estado: string) => {
    if (estado !== "disponible") return;
    setAsientosSeleccionados((prev) =>
      prev.includes(idAsiento)
        ? prev.filter((i) => i !== idAsiento)
        : [...prev, idAsiento]
    );
  };

  // 🔹 Ir a la vista de pago
  const irAPago = () => {
    navigate("/pagoBoletos", {
        state: {
        asientosSeleccionados,
        zonaId: parseInt(zonaSeleccionada),
        eventoId: parseInt(eventoSeleccionado),
        },
    });
};

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6">
      {/* 🗺️ Mapa del evento */}
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2">🗺️ Mapa del evento</h2>

        {/* Selector de eventos */}
        <select
          name="evento"
          id="evento"
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={eventoSeleccionado}
          onChange={(e) => {
            setEventoSeleccionado(e.target.value);
            setZonaSeleccionada("");
            setAsientosSeleccionados([]); // resetear selección
          }}
        >
          <option value="">-- Seleccione un evento --</option>
          {eventosActivos.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre} — {e.hora}
            </option>
          ))}
        </select>

        <img
          src={BitMap}
          alt="Mapa del evento"
          className="w-full max-w-lg rounded-lg shadow-sm mt-4"
        />
      </div>

      {/* 📋 Información del evento */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-bold mb-2 text-blue-700">
          🎟️ Selección de zona
        </h2>
        <p className="text-gray-700 mb-3">Seleccione la zona de su preferencia:</p>

        {/* Selector de zonas */}
        <select
          name="zona"
          id="zona"
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={zonaSeleccionada}
          onChange={(e) => {
            setZonaSeleccionada(e.target.value);
            setAsientosSeleccionados([]); // reset
          }}
          disabled={!eventoSeleccionado} // desactivar hasta elegir evento
        >
          <option value="">-- Seleccione una zona --</option>
          {zonas.map((z) => (
            <option key={z.id} value={z.id}>
              {z.nombre} — ${z.precio}
            </option>
          ))}
        </select>

        {/* Panel dinámico de asientos */}
        {zonaSeleccionada && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Zona seleccionada:{" "}
              {zonas.find((z) => z.id === parseInt(zonaSeleccionada))?.nombre}
            </h3>

            <div className="grid grid-cols-5 gap-2 justify-center">
              {asientosZona.map((asiento) => {
                const seleccionado = asientosSeleccionados.includes(asiento.id);
                const estado = asiento.estado.toLowerCase();

                let color = "#22c55e"; // disponible
                if (estado === "reservado") color = "#f59e0b";
                else if (estado === "vendido") color = "#ef4444";
                else if (seleccionado) color = "#3b82f6";

                return (
                  <button
                    key={asiento.id}
                    onClick={() => toggleAsiento(asiento.id, asiento.estado)}
                    disabled={estado !== "disponible"}
                    className="flex items-center justify-center"
                    title={`Asiento ${asiento.numeroAsiento} (${estado})`}
                  >
                    <EventSeatIcon
                      style={{
                        color: color,
                        fontSize: "2.5rem",
                        opacity: estado !== "disponible" ? 0.6 : 1,
                        cursor:
                          estado !== "disponible" ? "not-allowed" : "pointer",
                        transition: "transform 0.15s ease",
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Asientos seleccionados */}
            {asientosSeleccionados.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-3">
                  Asientos seleccionados:{" "}
                  {asientosZona
                    .filter((a) => asientosSeleccionados.includes(a.id))
                    .map((a) => a.numeroAsiento)
                    .join(", ")}
                </p>

                <button
                  onClick={irAPago}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                >
                  💳 Comprar boletos
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
