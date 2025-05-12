<?php
require 'conexion.php';

if (isset($_POST['id_usuario'])) {
    $id = intval($_POST['id_usuario']);
    
    // validamos si el usuario existe antes de eliminar
    $stmt_check = $conn->prepare("SELECT id_usuario FROM Usuario WHERE id_usuario = ?");
    $stmt_check->bind_param("i", $id);
    $stmt_check->execute();
    $stmt_check->store_result();
    
    if ($stmt_check->num_rows === 0) {
        echo "El usuario no existe.";
        exit;
    }
    
    $stmt = $conn->prepare("DELETE FROM Usuario WHERE id_usuario = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "success"; // Éxito (manejado en JS)
    } else {
        echo "Error al eliminar usuario.";
    }

    $stmt->close();
} else {
    echo "ID inválido.";
}
?>
