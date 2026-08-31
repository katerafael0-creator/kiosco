<?php
header('Content-Type: application/json');
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['alertas'])) {
        $stmt = $db->query("SELECT * FROM producto WHERE stock <= stock_minimo");
        echo json_encode($stmt->fetchAll());
        exit();
    }
    $stmt = $db->query("SELECT * FROM producto ORDER BY id_producto DESC");
    echo json_encode($stmt->fetchAll());
    exit();
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!empty($data['nombre'])) {
        $stmt = $db->prepare("INSERT INTO producto (nombre, precio_compra, precio_venta, stock, stock_minimo, id_categoria) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['nombre'],
            $data['precio_compra'],
            $data['precio_venta'],
            $data['stock'],
            $data['stock_minimo'],
            $data['id_categoria'] ?? 1
        ]);
        echo json_encode(['success' => true]);
    }
    exit();
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? 0;
    if ($id) {
        $stmt = $db->prepare("DELETE FROM producto WHERE id_producto = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    }
    exit();
}
?>
