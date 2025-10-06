import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./presentation/Layout/Layout";
import Dashboard from "./presentation/dashboard/dashboard";
import Events from "./presentation/events/Events";
import Login from "./presentation/Login/Login";

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
    </Routes>
  );
};

export default App;
