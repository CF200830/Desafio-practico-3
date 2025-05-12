<?php
require 'conexion.php';

if (
    isset($_POST['id'], $_POST['nombre'], $_POST['correo'], $_POST['fecha']) &&
    !empty($_POST['nombre']) &&
    !empty($_POST['correo']) &&
    !empty($_POST['fecha'])
) {
    $id = intval($_POST['id']);
    $nombre = trim($_POST['nombre']);
    $correo = trim($_POST['correo']);
    $fecha = $_POST['fecha'];

    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        echo "Correo electrónico inválido.";
        exit;
    }

    $stmt = $conn->prepare("UPDATE Usuario SET nombre = ?, correo = ?, fecha_nacimiento = ? WHERE id_usuario = ?");
    $stmt->bind_param("sssi", $nombre, $correo, $fecha, $id);

    if ($stmt->execute()) {
        echo "Usuario actualizado correctamente.";
    } else {
        echo "Error al actualizar usuario.";
    }

    $stmt->close();
} else {
    echo "Faltan datos obligatorios.";
}
?>
