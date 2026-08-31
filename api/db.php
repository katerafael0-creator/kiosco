<?php
try {
    $db = new PDO('sqlite:' . __DIR__ . '/../db/kiosco.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $db->exec("CREATE TABLE IF NOT EXISTS producto (
        id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precio_compra REAL NOT NULL,
        precio_venta REAL NOT NULL,
        stock INTEGER NOT NULL,
        stock_minimo INTEGER NOT NULL,
        id_categoria INTEGER DEFAULT 1
    )");

    $db->exec("CREATE TABLE IF NOT EXISTS movimiento (
        id_movimiento INTEGER PRIMARY KEY AUTOINCREMENT,
        id_producto INTEGER NOT NULL,
        tipo_movimiento TEXT NOT NULL,
        cantidad INTEGER NOT NULL,
        fecha TEXT NOT NULL,
        FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
    )");
} catch (PDOException $e) {
    die(json_encode(['error' => $e->getMessage()]));
}
?>
