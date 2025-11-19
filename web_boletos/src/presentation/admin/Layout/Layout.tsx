import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
} from "@mui/material";
import {
  AssessmentOutlined,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Logout,
  People as PeopleIcon,
  Settings,
  History,
  AddBusinessTwoTone,
  Backup,
} from "@mui/icons-material";
import { NavLink, Outlet } from "react-router-dom";

const drawerWidth = 240;

const navItems = [
  { text: "Panel", to: "/dashboard", icon: <DashboardIcon /> },
  { text: "Eventos", to: "/events", icon: <EventIcon /> },
  { text: "Usuarios", to: "/users", icon: <PeopleIcon /> },
  { text: "Zonas", to: "/zones", icon: <Settings /> },
  { text: "Reportes", to: "/reports", icon: <AssessmentOutlined /> },
  { text: "Historial de pagos", to: "/payment-history", icon: <History /> },
  { text: "Vender manualmente", to: "/VenderManualmente", icon: <AddBusinessTwoTone /> },
  { text: "Restauracion y Respaldo BD", to: "/backup-restore", icon: <Backup /> },
  { text: "Cerrar Sesión", to: "/", icon: <Logout /> },
];

const Layout: React.FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Top bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#1976d2",
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            🎟️ Venta de Boletos Estadio Rigoberto López Pérez - León
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              sx={{
                "&.active": {
                  backgroundColor: "rgba(25,118,210,0.08)",
                  "& .MuiListItemIcon-root": { color: "#1976d2" },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "#f4f6f8", minHeight: "100vh", p: 3 }}
      >
        <Toolbar /> {/* espacio para el AppBar */}
        <Outlet /> {/* aquí se renderizan las páginas hijas */}
      </Box>
    </Box>
  );
};

export default Layout;
