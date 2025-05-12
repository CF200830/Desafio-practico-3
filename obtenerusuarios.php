<?php
require 'conexion.php';

// consultar todos los usuarios
$sql = "SELECT id_usuario, nombre, correo, fecha_nacimiento FROM Usuario ORDER BY id_usuario DESC";
$result = $conn->query($sql);

$usuarios = [];

if ($result->num_rows > 0) {
    while ($fila = $result->fetch_assoc()) {
        $usuarios[] = $fila;
    }
}

// devolver los datos como JSON
header('Content-Type: application/json');
echo json_encode($usuarios);
exit;
?>
