import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BitMap from "../../../assets/bitmap.png";
import EventSeatIcon from "@mui/icons-material/EventSeat";

export default function MostrarMapaEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string>("");
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<number[]>([]);
  const [asientosOcupados, setAsientosOcupados] = useState<number[]>([]);

  // 🔹 Configuración de zonas
  const zonas = {
    "1": { nombre: "Jardín", filas: 4, columnas: 10 },
    "2": { nombre: "VIP", filas: 3, columnas: 6 },
    "3": { nombre: "Mezanine terreno", filas: 5, columnas: 8 },
    "4": { nombre: "HomePlate", filas: 4, columnas: 12 },
    "5": { nombre: "Mezzanine HomePlate", filas: 3, columnas: 10 },
    "6": { nombre: "Palco", filas: 2, columnas: 5 },
  };

  const zonaActual = zonas[zonaSeleccionada as keyof typeof zonas];

  // 🔸 Generar asientos ocupados simulados
  useEffect(() => {
    if (zonaActual) {
      const total = zonaActual.filas * zonaActual.columnas;
      const cantidadOcupados = Math.floor(total * 0.2);
      const ocupados = new Set<number>();
      while (ocupados.size < cantidadOcupados) {
        ocupados.add(Math.floor(Math.random() * total));
      }
      setAsientosOcupados([...ocupados]);
      setAsientosSeleccionados([]);
    }
  }, [zonaSeleccionada]);

  // 🔸 Alternar selección
  const toggleAsiento = (index: number) => {
    if (asientosOcupados.includes(index)) return;

    setAsientosSeleccionados((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // 🔸 Ir a la vista de pago
  const irAPago = () => {
    if (zonaActual && asientosSeleccionados.length > 0) {
      navigate("/client/procesar_pago", {
        state: {
          eventoId: id,
          zona: zonaActual.nombre,
          boletos: asientosSeleccionados.map((a) => a + 1),
        },
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6">
      {/* 🗺️ Mapa del evento */}
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2">🗺️ Mapa del evento</h2>
        <p className="text-gray-700 mb-4">
          Este es el evento seleccionado con ID: <strong>{id}</strong>
        </p>
        <img
          src={BitMap}
          alt="Mapa del evento"
          className="w-full max-w-lg rounded-lg shadow-sm"
        />
      </div>

      {/* 📋 Información del evento */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-bold mb-2 text-blue-700">
          🎟️ Evento seleccionado
        </h2>
        <p className="text-gray-700 mb-3">Seleccione la zona de su preferencia:</p>

        {/* Selector de zonas */}
        <select
          name="zona"
          id="zona"
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={zonaSeleccionada}
          onChange={(e) => setZonaSeleccionada(e.target.value)}
        >
          <option value="">-- Seleccione una zona --</option>
          {Object.entries(zonas).map(([id, z]) => (
            <option key={id} value={id}>
              {z.nombre}
            </option>
          ))}
        </select>

        {/* Panel dinámico de asientos */}
        {zonaActual && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Zona seleccionada: {zonaActual.nombre}
            </h3>
            <p className="text-gray-600 mb-3">
              Distribución de asientos ({zonaActual.filas} filas ×{" "}
              {zonaActual.columnas} columnas)
            </p>

            <div
              className="grid gap-1 justify-center"
              style={{
                gridTemplateColumns: `repeat(${zonaActual.columnas}, 1fr)`,
              }}
            >
              {Array.from({
                length: zonaActual.filas * zonaActual.columnas,
              }).map((_, i) => {
                const seleccionado = asientosSeleccionados.includes(i);
                const ocupado = asientosOcupados.includes(i);

                // 🎨 Colores según estado
                let color = "#22c55e"; // verde
                if (ocupado) color = "#ef4444"; // rojo
                else if (seleccionado) color = "#3b82f6"; // azul

                return (
                  <button
                    key={i}
                    onClick={() => toggleAsiento(i)}
                    disabled={ocupado}
                    className="flex items-center justify-center"
                    title={`Asiento ${i + 1}${
                      ocupado ? " (Ocupado)" : seleccionado ? " (Seleccionado)" : ""
                    }`}
                  >
                    <EventSeatIcon
                      style={{
                        color: color,
                        fontSize: "3rem",
                        opacity: ocupado ? 0.6 : 1,
                        cursor: ocupado ? "not-allowed" : "pointer",
                        transition: "transform 0.15s ease",
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Mostrar asientos seleccionados */}
            {asientosSeleccionados.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-3">
                  Asientos seleccionados:{" "}
                  {asientosSeleccionados.map((a) => a + 1).join(", ")}
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
