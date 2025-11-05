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
import UsuarioComponent from "./presentation/admin/Users/Usuarios";
import ZonasComponent from "./presentation/admin/Zones/Zona";
import VenderManualmente from "./presentation/admin/Store/Store";
import PagoBoletosEfectivo from "./presentation/admin/Payment/PagoBoletos";
import PagoExitoso from "./presentation/client/Pago/Pago_exitoso";
import PaymentHistory from "./presentation/admin/PaymentHistory/PaymentHistory";
import ReportPayments from "./presentation/admin/Reports/ReportPayments";
import Register from "./presentation/Login/Register";
import ConfirmacionBoletos from "./presentation/admin/Payment/Boletos/GenerarBoletos";


const App: React.FC = () => {
  return (
    <Routes>
      {/* Ruta para Login sin el Layout */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas dentro del Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/users" element={<UsuarioComponent />} />
        <Route path="/zones" element={<ZonasComponent />} />
        <Route path="/reports" element={<ReportPayments />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/VenderManualmente" element={<VenderManualmente />} />
        <Route path="/pagoBoletos" element={<PagoBoletosEfectivo />} />
        <Route path="/confirmacion" element={<ConfirmacionBoletos />} />
      </Route>

      <Route element={<LayoutClient />}>
        <Route path="/client" element={<DashboardClient />} />
        <Route path="/client/eventos" element={<EventClient />} />
        <Route path="/client/MostrarMapaEvento/:id" element={<MapForEvent />} />
        <Route path="/client/procesar_pago" element={<PagoBoletos />} />
        <Route path="/client/pago_exitoso" element={<PagoExitoso />} />
      </Route>

    </Routes>
  );
};

export default App;
