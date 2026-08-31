<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $id_producto = $data['id_producto'];
    $tipo = $data['tipo_movimiento']; // "Entrada" o "Salida"
    $cantidad = (int)$data['cantidad'];
    $fecha = date('Y-m-d');

    // 1. Registrar movimiento
    $stmt = $db->prepare("INSERT INTO movimiento (id_producto, tipo_movimiento, cantidad, fecha) VALUES (?, ?, ?, ?)");
    $stmt->execute([$id_producto, $tipo, $cantidad, $fecha]);

    // 2. Actualizar stock
    if ($tipo === 'Entrada') {
        $update = $db->prepare("UPDATE producto SET stock = stock + ? WHERE id_producto = ?");
    } else {
        $update = $db->prepare("UPDATE producto SET stock = stock - ? WHERE id_producto = ?");
    }
    $success = $update->execute([$cantidad, $id_producto]);

    echo json_encode(['success' => $success]);
    exit();
}
?>