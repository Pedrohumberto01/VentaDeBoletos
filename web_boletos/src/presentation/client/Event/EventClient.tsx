
import eventChampions from "../../../assets/event_champions.jpg";
import eventClasic from "../../../assets/event_clasicmlb.jpg";
import eventLBPN from "../../../assets/event_lbpn.png";
import eventOpening from "../../../assets/event_opening.jpg";
import eventSuperHero from "../../../assets/event_superhero.jpg";
import eventWorldSeries from "../../../assets/event_worldseries.jpg";

// Simulación de datos que vendrían de tu API
const eventos = [
  {
    id: 1,
    nombre: "Gran evento de los champions",
    descripcion: "Gran concierto de rock con bandas nacionales e internacionales.",
    fecha: "2025-10-20",
    hora: "19:00:00",
    imagen: eventChampions,
  },
  {
    id: 2,
    nombre: "Disfruta de un clasico",
    descripcion: "Final del torneo local en nuestro estadio.",
    fecha: "2025-10-25",
    hora: "17:00:00",
    imagen: eventClasic,
  },
  {
    id: 3,
    nombre: "Envuelvete en la nueva liga de LBNP",
    descripcion: "Disfruta de un día lleno de música y diversión para toda la familia.",
    fecha: "2025-11-05",
    hora: "12:00:00",
    imagen: eventLBPN,
  },
  {
    id: 4,
    nombre: "Disfruta el opening day de este año",
    descripcion: "Disfruta de un día lleno de música y diversión para toda la familia.",
    fecha: "2025-11-05",
    hora: "12:00:00",
    imagen: eventOpening,
  },
  {
    id: 5,
    nombre: "Festival de Superheroes",
    descripcion: "Disfruta de un día lleno de música y diversión para toda la familia.",
    fecha: "2025-11-05",
    hora: "12:00:00",
    imagen: eventSuperHero,
  },
  {
    id: 6,
    nombre: "Las world series estan aqui",
    descripcion: "Disfruta de un día lleno de música y diversión para toda la familia.",
    fecha: "2025-11-05",
    hora: "12:00:00",
    imagen: eventWorldSeries,
  },
];

export default function EventClient() {
  return (
    <div className="p-6 grid md:grid-cols-3 sm:grid-cols-2 gap-6">
      {eventos.map((evento) => (
        <div
          key={evento.id}
          className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <img
            src={evento.imagen}
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
            <p className="text-gray-800 font-medium">
              Hora: {evento.hora}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
