import React from "react";
import EventIcon from "@mui/icons-material/Event";
import StoreIcon from "@mui/icons-material/Store";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ArticleIcon from "@mui/icons-material/Article";
import { Outlet } from "react-router-dom";

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
              src="https://scontent.fmga9-2.fna.fbcdn.net/v/t39.30808-6/480438874_122135051336520352_4713847335549288368_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=yFHS156WL8EQ7kNvwHhu36p&_nc_oc=AdmbV9XwWVXyskCyaJSiuud9pMTrQP4DlFz2d5rilfofLr1BxTpPBCG7DOxyn-pvamU&_nc_zt=23&_nc_ht=scontent.fmga9-2.fna&_nc_gid=PQCMOvQJaxD7_o8-L5dQiA&oh=00_AfdF_jYKliQzZzoEnaJNGFp5q089imtFL37YEV5644K7EQ&oe=68E8F844"
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
                <EventIcon fontSize="small" />
                Eventos
              </a>
            </li>
            <li>
              <a
                href="/client"
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <StoreIcon fontSize="small" />
                Productos
              </a>
            </li>
            <li>
              <a
                href="/client"
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <LocalOfferIcon fontSize="small" />
                Promociones
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
