import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./presentation/admin/Layout/Layout";
import Dashboard from "./presentation/admin/dashboard/dashboard";
import Events from "./presentation/admin/events/Events";
import Login from "./presentation/Login/Login";
import DashboardClient from "./presentation/client/Dashboard/DashboardClient";
import LayoutClient from "./presentation/client/Layout/LayoutClient";
import EventClient from "./presentation/client/Event/EventClient";
import MapForEvent from "./presentation/client/Map/MapForEvent";
import PagoBoletos from "./presentation/client/Pago/PagoBoletos";

// Componente temporal de Users
const Users: React.FC = () => (
  <div>
    <h2>👥 Usuarios</h2>
    <p>Vista temporal — aquí se implementará la gestión de usuarios.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Routes>
      {/* Ruta para Login sin el Layout */}
      <Route path="/" element={<Login />} />

      {/* Rutas protegidas dentro del Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/users" element={<Users />} />
      </Route>

      <Route element={<LayoutClient />}>
        <Route path="/client" element={<DashboardClient />} />
        <Route path="/client/eventos" element={<EventClient />} />
        <Route path="/client/MostrarMapaEvento/:id" element={<MapForEvent />} />
        <Route path="/client/procesar_pago" element={<PagoBoletos />} />
      </Route>

    </Routes>
  );
};

export default App;
