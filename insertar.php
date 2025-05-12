<?php
require 'conexion.php';

// validar que se reciban todos los datos
if (
    isset($_POST['nombre'], $_POST['correo'], $_POST['password'], $_POST['fecha']) &&
    !empty($_POST['nombre']) &&
    !empty($_POST['correo']) &&
    !empty($_POST['password']) &&
    !empty($_POST['fecha'])
) {
    $nombre = trim($_POST['nombre']);
    $correo = trim($_POST['correo']);
    $password = trim($_POST['password']);
    $fecha = $_POST['fecha'];

    // validar formato de correo
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        echo "Correo electrónico inválido.";
        exit;
    }
        $stmt_check = $conn->prepare("SELECT id_usuario FROM Usuario WHERE correo = ?");
        $stmt_check->bind_param("s", $correo);
        $stmt_check->execute();
        $stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    echo "El correo ya está registrado.";
    exit;
}

    // validar longitud de contraseña
    if (strlen($password) < 6) {
        echo "La contraseña debe tener al menos 6 caracteres.";
        exit;
    }

    // encriptar la contraseña
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // insertar en la base de datos
    $stmt = $conn->prepare("INSERT INTO Usuario (nombre, contraseña, correo, fecha_nacimiento) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $nombre, $passwordHash, $correo, $fecha);

    if ($stmt->execute()) {
        echo "Usuario registrado exitosamente.";
    } else {
        echo "Error al registrar: " . $conn->error;
    }

    $stmt->close();
} else {
    echo "Todos los campos son obligatorios.";
}
?>
