import React from "react";
import EventIcon from "@mui/icons-material/Event";
import ArticleIcon from "@mui/icons-material/Article";
import { Outlet } from "react-router-dom";
import { AccountCircle, Home } from "@mui/icons-material";

const LayoutClient: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <a href="/client" className="flex items-center">
            <img
              className="h-10 hidden sm:block"
              src="https://logosnicas.com/wp-content/uploads/2022/08/leones_de_leon_logo.png"
              alt="Logo"
            />
            <img
              className="h-10 sm:hidden"
              src="img/logo_tt_movil.svg"
              alt="Logo móvil"
            />
          </a>

          {/* Menú */}
          <ul className="hidden sm:flex space-x-6 font-semibold">
            <li>
              <a
                href="/client"
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <Home fontSize="small" />
                Inicio
              </a>
            </li>
            <li>
              <a
                href="/client/eventos"
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <EventIcon fontSize="small" />
                Eventos
              </a>
            </li>
            <li>
              <a
                href="/client"
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <ArticleIcon fontSize="small" />
                Noticias
              </a>
            </li>
            <li>
              <a
                href="/client"
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <AccountCircle fontSize="small" />
                Registrate
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="flex-1 container mx-auto p-4">
        <Outlet /> {/* <- Aquí se mostrarán las rutas hijas */}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 text-gray-600">
        &copy; 2025 Venta de Boletos. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default LayoutClient;
