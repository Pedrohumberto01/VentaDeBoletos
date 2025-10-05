import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./presentation/Layout/Layout";
import Dashboard from "./presentation/dashboard/dashboard";
import Events from "./presentation/events/Events";

// Placeholder para Users (más adelante lo implementan)
const Users: React.FC = () => (
  <div>
    <h2>👥 Usuarios</h2>
    <p>Vista temporal — aquí se implementará la gestión de usuarios.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Layout>
  );
};

export default App;
