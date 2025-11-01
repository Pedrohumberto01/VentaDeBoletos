DELIMITER //
CREATE FUNCTION VerificarCredenciales(p_email VARCHAR(150), p_contrasenia VARCHAR(255))
RETURNS VARCHAR(50)
DETERMINISTIC
BEGIN
    DECLARE v_rol VARCHAR(50);

    SELECT rol INTO v_rol
    FROM usuarios
    WHERE email = p_email AND contrasenia = p_contrasenia
    LIMIT 1;

    RETURN IFNULL(v_rol, 'no_existe');
END//
DELIMITER ;

