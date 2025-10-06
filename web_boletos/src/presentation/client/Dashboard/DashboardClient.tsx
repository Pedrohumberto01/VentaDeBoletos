

export default function DashboardClient() {
  return (
    <div>
      {/* Banner principal */}
      <div className="relative bg-blue-800 rounded-lg overflow-hidden mb-8">
        <img
          src="https://www.el19digital.com/files/notas/source/2024/SEPTIEMBRE/19-Septiembre/ESTADIO/ESTADIO5.jpeg"
          alt="Estadio"
          className="w-full h-120 object-cover opacity-80"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Bienvenido al Estadio: Rigoberto Lopez Perez
          </h1>
          <p className="text-lg md:text-xl text-center">
            Disfruta la mejor experiencia en nuestros eventos deportivos y culturales.
          </p>
        </div>
      </div>

      {/* Información del estadio */}
      <section className=" gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">🏟️ Información del Estadio Rigoberto López Pérez</h2>
          <p>El Estadio Rigoberto López Pérez, conocido como «la casa de los leones», es un moderno recinto deportivo ubicado en León, Nicaragua. Inaugurado el 27 de septiembre de 2024, es sede del equipo de béisbol Leones de León y ha sido escenario de importantes eventos nacionales e internacionales.</p>
        </div>
      </section>

      {/* Información del estadio */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">Datos Clave</h2>
          <p>Estadio: Rigoberto López Pérez</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">Ubicación</h2>
          <p>Av. Central 123, Managua, Nicaragua</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">Año de Inauguración</h2>
          <p>1995</p>
        </div>
      </section>
    </div>
  );
}
