<?php
header('Content-Type: application/json');
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $sql = "SELECT m.id_movimiento, m.tipo_movimiento, m.cantidad, m.fecha, p.nombre AS producto 
                FROM movimiento m 
                LEFT JOIN producto p ON m.id_producto = p.id_producto 
                ORDER BY m.id_movimiento DESC";
        $stmt = $db->query($sql);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($res ? $res : []);
    } catch (Exception $e) {
        echo json_encode([]);
    }
    exit();
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $id_producto = (int)($data['id_producto'] ?? 0);
    $tipo = $data['tipo_movimiento'] ?? '';
    $cantidad = (int)($data['cantidad'] ?? 0);
    $fecha = date('Y-m-d');

    if ($id_producto > 0 && $cantidad > 0 && !empty($tipo)) {
        try {
            $stmt = $db->prepare("INSERT INTO movimiento (id_producto, tipo_movimiento, cantidad, fecha) VALUES (?, ?, ?, ?)");
            $stmt->execute([$id_producto, $tipo, $cantidad, $fecha]);

            if ($tipo === 'Entrada') {
                $update = $db->prepare("UPDATE producto SET stock = stock + ? WHERE id_producto = ?");
            } else {
                $update = $db->prepare("UPDATE producto SET stock = stock - ? WHERE id_producto = ?");
            }
            $update->execute([$cantidad, $id_producto]);

            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Por favor completa todos los campos']);
    }
    exit();
}
?>
