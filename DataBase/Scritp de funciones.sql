DELIMITER //
CREATE FUNCTION VerificarCredenciales(p_email VARCHAR(150), p_contrasenia VARCHAR(255))
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE existe INT;

    SELECT COUNT(*) INTO existe
    FROM usuarios
    WHERE email = p_email AND contrasenia = p_contrasenia;

    IF existe > 0 THEN
        RETURN 1; -- Credenciales válidas
    ELSE
        RETURN 0; -- No existe usuario con esas credenciales
    END IF;
END//
DELIMITER ;
