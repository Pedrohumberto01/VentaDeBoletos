
DROP DATABASE IF EXISTS db_ventaboletos;

CREATE DATABASE db_ventaboletos;

USE db_ventaboletos;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cedula varchar(15),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','cliente') DEFAULT 'cliente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    imagen VARCHAR(255), -- ruta de la imagen promocional
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE zonas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    capacidad INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE asientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zona_id INT NOT NULL,
    numero_asiento VARCHAR(20) NOT NULL,
    estado ENUM('disponible','reservado','vendido') DEFAULT 'disponible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (zona_id) REFERENCES zonas(id)
);

CREATE TABLE boletos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    evento_id INT NOT NULL,
    zona_id INT NOT NULL,
    asiento_id INT, -- opcional si el evento no es por asiento
    precio DECIMAL(10,2) NOT NULL,
    estado ENUM('reservado','pagado','cancelado') DEFAULT 'reservado',
    codigo_qr VARCHAR(255), -- para validar en la entrada
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (evento_id) REFERENCES eventos(id),
    FOREIGN KEY (zona_id) REFERENCES zonas(id),
    FOREIGN KEY (asiento_id) REFERENCES asientos(id)
);

CREATE TABLE pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    boleto_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('tarjeta','paypal','efectivo','stripe') NOT NULL,
    estado_pago ENUM('pendiente','pagado','fallido') DEFAULT 'pendiente',
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (boleto_id) REFERENCES boletos(id)
);