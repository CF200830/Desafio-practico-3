<?php
$host = 'localhost';
$db = 'usuarios';
$user = 'root';
$password = ''; 

$conn = new mysqli($host, $user, $password, $db);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>