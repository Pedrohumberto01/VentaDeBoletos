
USE db_ventaboletos;

/* INSERTAR USUARIOS DE PRUEBA A LA BASE DE DATOS*/

INSERT INTO usuarios (nombre, cedula, email, contrasenia, rol)
VALUES
('administrador del sistema','0810808081000K','admin@gmail.com','1234','admin'),
('cliente de prueba del sistema','0800101010000C','cliente@gmail.com','1234','cliente');

/* INSERTAR EVENTOS DE PRUEBA A LA BASE DE DATOS*/

INSERT INTO eventos (nombre, descripcion, fecha, hora, imagen) 
VALUES
('Boer vs Pomares', 'Juego de baseball de la federación nacional', '2025-11-07', '16:00:00', 'url de la imagen'),
('Tigres vs Tren del norte', 'Juego de baseball de la federación nacional', '2025-12-03', '08:00:00', 'url de la imagen'),
('UNAN vs DLL', 'Juego de exhibición', '2025-11-26', '14:00:00', 'url'),
('Juego Communitario: Lleva a tu equipo!', 'Este es el mejor torneo de baseball del momento, lleva a tu equipo e intenta dominar a los demas', '2025-12-25', '17:00:00', 'url');


/* INSERTAR ZONAS A LA BASE DE DATOS*/

INSERT INTO zonas (nombre, capacidad, precio) VALUES
('Palco', 100, 315.00),
('Mezzanine HomePlate', 100, 215.00),
('HomePlate', 100, 165.00),
('Mezzanine Terreno', 100, 115.00),
('VIP', 100, 115.00),
('Jardin', 100, 65.00);

/* INSERTAR TODOS LOS ASIENTOS A LA BASE DE DATOS*/

-- Inserción de asientos para la zona palco
INSERT INTO asientos (zona_id, numero_asiento, estado)
VALUES
(1, 'A1', 'disponible'),
(1, 'A2', 'disponible'),
(1, 'A3', 'disponible'),
(1, 'A4', 'disponible'),
(1, 'A5', 'disponible'),
(1, 'A6', 'disponible'),
(1, 'A7', 'disponible'),
(1, 'A8', 'disponible'),
(1, 'A9', 'disponible'),
(1, 'A10', 'disponible'),
(1, 'A11', 'disponible'),
(1, 'A12', 'disponible'),
(1, 'A13', 'disponible'),
(1, 'A14', 'disponible'),
(1, 'A15', 'disponible'),
(1, 'A16', 'disponible'),
(1, 'A17', 'disponible'),
(1, 'A18', 'disponible'),
(1, 'A19', 'disponible'),
(1, 'A20', 'disponible');


-- Inserción de asientos para la zona Mezzanine HomePlate
INSERT INTO asientos (zona_id, numero_asiento, estado)
VALUES
(2, 'B1', 'disponible'),
(2, 'B2', 'disponible'),
(2, 'B3', 'disponible'),
(2, 'B4', 'disponible'),
(2, 'B5', 'disponible'),
(2, 'B6', 'disponible'),
(2, 'B7', 'disponible'),
(2, 'B8', 'disponible'),
(2, 'B9', 'disponible'),
(2, 'B10', 'disponible'),
(2, 'B11', 'disponible'),
(2, 'B12', 'disponible'),
(2, 'B13', 'disponible'),
(2, 'B14', 'disponible'),
(2, 'B15', 'disponible'),
(2, 'B16', 'disponible'),
(2, 'B17', 'disponible'),
(2, 'B18', 'disponible'),
(2, 'B19', 'disponible'),
(2, 'B20', 'disponible');


-- Inserción de asientos para la zona HomePlate
INSERT INTO asientos (zona_id, numero_asiento, estado)
VALUES
(3, 'C1', 'disponible'),
(3, 'C2', 'disponible'),
(3, 'C3', 'disponible'),
(3, 'C4', 'disponible'),
(3, 'C5', 'disponible'),
(3, 'C6', 'disponible'),
(3, 'C7', 'disponible'),
(3, 'C8', 'disponible'),
(3, 'C9', 'disponible'),
(3, 'C10', 'disponible'),
(3, 'C11', 'disponible'),
(3, 'C12', 'disponible'),
(3, 'C13', 'disponible'),
(3, 'C14', 'disponible'),
(3, 'C15', 'disponible'),
(3, 'C16', 'disponible'),
(3, 'C17', 'disponible'),
(3, 'C18', 'disponible'),
(3, 'C19', 'disponible'),
(3, 'C20', 'disponible');


-- Inserción de asientos para la zona Mezzanine Terreno
INSERT INTO asientos (zona_id, numero_asiento, estado)
VALUES
(4, 'D1', 'disponible'),
(4, 'D2', 'disponible'),
(4, 'D3', 'disponible'),
(4, 'D4', 'disponible'),
(4, 'D5', 'disponible'),
(4, 'D6', 'disponible'),
(4, 'D7', 'disponible'),
(4, 'D8', 'disponible'),
(4, 'D9', 'disponible'),
(4, 'D10', 'disponible'),
(4, 'D11', 'disponible'),
(4, 'D12', 'disponible'),
(4, 'D13', 'disponible'),
(4, 'D14', 'disponible'),
(4, 'D15', 'disponible'),
(4, 'D16', 'disponible'),
(4, 'D17', 'disponible'),
(4, 'D18', 'disponible'),
(4, 'D19', 'disponible'),
(4, 'D20', 'disponible');


-- Inserción de asientos para la zona VIP
INSERT INTO asientos (zona_id, numero_asiento, estado)
VALUES
(5, 'E1', 'disponible'),
(5, 'E2', 'disponible'),
(5, 'E3', 'disponible'),
(5, 'E4', 'disponible'),
(5, 'E5', 'disponible'),
(5, 'E6', 'disponible'),
(5, 'E7', 'disponible'),
(5, 'E8', 'disponible'),
(5, 'E9', 'disponible'),
(5, 'E10', 'disponible'),
(5, 'E11', 'disponible'),
(5, 'E12', 'disponible'),
(5, 'E13', 'disponible'),
(5, 'E14', 'disponible'),
(5, 'E15', 'disponible'),
(5, 'E16', 'disponible'),
(5, 'E17', 'disponible'),
(5, 'E18', 'disponible'),
(5, 'E19', 'disponible'),
(5, 'E20', 'disponible');


-- Inserción de asientos para la zona Jardin
INSERT INTO asientos (zona_id, numero_asiento, estado)
VALUES
(6, 'F1', 'disponible'),
(6, 'F2', 'disponible'),
(6, 'F3', 'disponible'),
(6, 'F4', 'disponible'),
(6, 'F5', 'disponible'),
(6, 'F6', 'disponible'),
(6, 'F7', 'disponible'),
(6, 'F8', 'disponible'),
(6, 'F9', 'disponible'),
(6, 'F10', 'disponible'),
(6, 'F11', 'disponible'),
(6, 'F12', 'disponible'),
(6, 'F13', 'disponible'),
(6, 'F14', 'disponible'),
(6, 'F15', 'disponible'),
(6, 'F16', 'disponible'),
(6, 'F17', 'disponible'),
(6, 'F18', 'disponible'),
(6, 'F19', 'disponible'),
(6, 'F20', 'disponible');
