import { useParams } from "react-router-dom";
import { useState } from "react";
import BitMap from "../../../assets/bitmap.png";

export default function MostrarMapaEvento() {
  const { id } = useParams();
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string>("");

  // 🔹 Ejemplo de configuración de asientos por zona
  const zonas = {
    "1": { nombre: "Jardín", filas: 4, columnas: 10 },
    "2": { nombre: "VIP", filas: 3, columnas: 6 },
    "3": { nombre: "Mezanine terreno", filas: 5, columnas: 8 },
    "4": { nombre: "HomePlate", filas: 4, columnas: 12 },
    "5": { nombre: "Mezzanine HomePlate", filas: 3, columnas: 10 },
    "6": { nombre: "Palco", filas: 2, columnas: 5 },
  };

  const zonaActual = zonas[zonaSeleccionada as keyof typeof zonas];

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
              }).map((_, i) => (
                <button
                  key={i}
                  className="w-6 h-6 bg-green-500 hover:bg-green-600 rounded-sm transition"
                  title={`Asiento ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
