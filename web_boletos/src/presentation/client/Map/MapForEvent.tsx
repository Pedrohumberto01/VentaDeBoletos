import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BitMap from "../../../assets/bitmap.png";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { Pagination } from "@mui/material";

export default function MostrarMapaEvento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [zonas, setZonas] = useState<any[]>([]);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string>("");
  const [asientos, setAsientos] = useState<any[]>([]);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<number[]>([]);

  // 🔹 Estados para paginación
  const [page, setPage] = useState(1);
  const asientosPorPagina = 20; // puedes ajustar a 20, 30, etc.

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
    traerZonas();
    traerAsientos();
  }, []);

  // 🔹 Filtrar asientos de la zona seleccionada
  const asientosZona = zonaSeleccionada
    ? asientos.filter((a) => a.zonaId === parseInt(zonaSeleccionada))
    : [];

  // 🔹 Paginación de asientos
  const totalPaginas = Math.ceil(asientosZona.length / asientosPorPagina);
  const inicio = (page - 1) * asientosPorPagina;
  const fin = inicio + asientosPorPagina;
  const asientosPaginados = asientosZona.slice(inicio, fin);

  // 🔹 Alternar selección
  const toggleAsiento = (idAsiento: number, estado: string) => {
    if (estado !== "disponible") return; // no se puede seleccionar reservado/vendido

    setAsientosSeleccionados((prev) =>
      prev.includes(idAsiento)
        ? prev.filter((i) => i !== idAsiento)
        : [...prev, idAsiento]
    );
  };

  // 🔹 Ir a la vista de pago
  const irAPago = () => {
    if (zonaSeleccionada && asientosSeleccionados.length > 0) {
      const zona = zonas.find((z) => z.id === parseInt(zonaSeleccionada));
      navigate("/client/procesar_pago", {
        state: {
          eventoId: id,
          zona: zona?.nombre,
          precio: zona?.precio,
          boletos: asientosSeleccionados,
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
            setPage(1); // reiniciar paginación al cambiar zona
          }}
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

            {/* Grid de asientos paginados */}
            <div className="grid grid-cols-5 gap-2 justify-center">
              {asientosPaginados.map((asiento) => {
                const seleccionado = asientosSeleccionados.includes(asiento.id);
                const estado = asiento.estado.toLowerCase();

                // 🎨 Colores según estado
                let color = "#22c55e"; // disponible (verde)
                if (estado === "reservado") color = "#f59e0b"; // amarillo
                else if (estado === "vendido") color = "#ef4444"; // rojo
                else if (seleccionado) color = "#3b82f6"; // azul (seleccionado)

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

            {/* 🔹 Paginación de asientos */}
            {totalPaginas > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination
                  count={totalPaginas}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </div>
            )}

            {/* Mostrar asientos seleccionados */}
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
