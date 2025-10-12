import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


import eventChampions from "../../../assets/event_champions.jpg";


export default function EventClient() {
  // Estado para guardar los eventos
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener eventos desde la API
  const ObtenerEventos = async () => {
    try {
      const response = await fetch("https://localhost:7082/api/Eventos/ObtenerEventos");
      if (!response.ok) throw new Error("Error al obtener eventos");
      const data = await response.json();
      setEventos(data);
    } catch (err: any) {
      console.error("Error al obtener eventos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ObtenerEventos();
  }, []);

  if (loading) return <p className="p-6">Cargando eventos...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (<>
    <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Seleccione el evento de su preferencia
    </h1>

    <div className="p-6 grid md:grid-cols-3 sm:grid-cols-2 gap-6">
      {eventos.map((evento) => (
        <Link key={evento.id} to={`/client/MostrarMapaEvento/${evento.id}`}>
          <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img
              //src={evento.imagen} // si quieres usar imágenes locales fallback, podemos agregarlo
              src={eventChampions}
              alt={evento.nombre}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{evento.nombre}</h2>
              <p className="text-gray-600 text-sm mb-2">
                {evento.descripcion.length > 100
                  ? evento.descripcion.substring(0, 100) + "..."
                  : evento.descripcion}
              </p>
              <p className="text-gray-800 font-medium">
                Fecha: {new Date(evento.fecha).toLocaleDateString()}
              </p>
              <p className="text-gray-800 font-medium">{evento.hora}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </>);
}
