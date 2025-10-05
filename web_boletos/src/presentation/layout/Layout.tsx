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
  Dashboard as DashboardIcon,
  Event as EventIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";

const drawerWidth = 240;

const navItems = [
  { text: "Panel", to: "/dashboard", icon: <DashboardIcon /> },
  { text: "Eventos", to: "/events", icon: <EventIcon /> },
  { text: "Usuarios", to: "/users", icon: <PeopleIcon /> },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Top bar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#1976d2" }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            🎟️ Venta de Boletos Estadio Rigoberto López Pérez - León
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer / Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              // NavLink agrega la clase "active" cuando la ruta coincide
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

      {/* Main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "#f4f6f8", minHeight: "100vh", p: 3 }}
      >
        <Toolbar /> {/* espacio para el AppBar fijo */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
