// Carga datos guardados o inicializa con productos de prueba
let productos = JSON.parse(localStorage.getItem('kiosco_productos')) || [
    { id_producto: 1, nombre: 'Coca Cola 500ml', precio_compra: 4.00, precio_venta: 6.00, stock: 12, stock_minimo: 5 },
    { id_producto: 2, nombre: 'Galletas Chomp', precio_compra: 2.00, precio_venta: 3.50, stock: 2, stock_minimo: 4 }
];

let movimientos = JSON.parse(localStorage.getItem('kiosco_movimientos')) || [
    { id_movimiento: 1, fecha: '2026-08-31', producto: 'Galletas Chomp', tipo_movimiento: 'Salida', cantidad: 3 }
];

document.addEventListener('DOMContentLoaded', () => {
    actualizarTodo();

    document.getElementById('form-producto').addEventListener('submit', agregarProducto);
    document.getElementById('form-movimiento').addEventListener('submit', registrarMovimiento);
});

function guardarEnLocalStorage() {
    localStorage.setItem('kiosco_productos', JSON.stringify(productos));
    localStorage.setItem('kiosco_movimientos', JSON.stringify(movimientos));
}

function cargarProductos() {
    const tbody = document.getElementById('tabla-productos');
    const selectMov = document.getElementById('select-producto-mov');

    tbody.innerHTML = '';
    selectMov.innerHTML = '<option value="">Seleccionar producto</option>';

    productos.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id_producto}</td>
                <td>${p.nombre}</td>
                <td>Bs. ${parseFloat(p.precio_venta).toFixed(2)}</td>
                <td><strong>${p.stock}</strong></td>
                <td><button class="btn-delete" onclick="eliminarProducto(${p.id_producto})">Eliminar</button></td>
            </tr>`;
        
        selectMov.innerHTML += `<option value="${p.id_producto}">${p.nombre} (Stock: ${p.stock})</option>`;
    });
}

function cargarMovimientos() {
    const tbody = document.getElementById('tabla-movimientos');
    tbody.innerHTML = '';

    if (movimientos.length > 0) {
        movimientos.slice().reverse().forEach(m => {
            const esEntrada = m.tipo_movimiento === 'Entrada';
            const color = esEntrada ? '#15803d' : '#b91c1c';

            tbody.innerHTML += `
                <tr>
                    <td>${m.id_movimiento}</td>
                    <td>${m.fecha}</td>
                    <td>${m.producto}</td>
                    <td><strong style="color: ${color}">${m.tipo_movimiento}</strong></td>
                    <td>${m.cantidad}</td>
                </tr>`;
        });
    } else {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748b;">Sin movimientos aún.</td></tr>`;
    }
}

function agregarProducto(e) {
    e.preventDefault();
    const nuevo = {
        id_producto: productos.length ? Math.max(...productos.map(p => p.id_producto)) + 1 : 1,
        nombre: document.getElementById('nombre').value,
        precio_compra: parseFloat(document.getElementById('precio_compra').value),
        precio_venta: parseFloat(document.getElementById('precio_venta').value),
        stock: parseInt(document.getElementById('stock').value),
        stock_minimo: parseInt(document.getElementById('stock_minimo').value)
    };

    productos.push(nuevo);
    guardarEnLocalStorage();
    document.getElementById('form-producto').reset();
    actualizarTodo();
}

function registrarMovimiento(e) {
    e.preventDefault();
    const idProducto = parseInt(document.getElementById('select-producto-mov').value);
    const tipo = document.getElementById('tipo_movimiento').value;
    const cantidad = parseInt(document.getElementById('cantidad_mov').value);

    const producto = productos.find(p => p.id_producto === idProducto);

    if (!producto) return alert('Selecciona un producto válido');

    if (tipo === 'Salida' && producto.stock < cantidad) {
        return alert('Stock insuficiente para realizar la venta');
    }

    if (tipo === 'Entrada') {
        producto.stock += cantidad;
    } else {
        producto.stock -= cantidad;
    }

    movimientos.push({
        id_movimiento: movimientos.length ? Math.max(...movimientos.map(m => m.id_movimiento)) + 1 : 1,
        producto: producto.nombre,
        tipo_movimiento: tipo,
        cantidad: cantidad,
        fecha: new Date().toISOString().split('T')[0]
    });

    guardarEnLocalStorage();
    document.getElementById('form-movimiento').reset();
    actualizarTodo();
}

function cargarAlertas() {
    const alertBox = document.getElementById('alert-box');
    const alertList = document.getElementById('alert-list');
    const alertas = productos.filter(p => p.stock <= p.stock_minimo);

    if (alertas.length > 0) {
        alertList.innerHTML = alertas.map(a => `<li><strong>${a.nombre}</strong> - Stock: ${a.stock} (Mínimo: ${a.stock_minimo})</li>`).join('');
        alertBox.style.display = 'block';
    } else {
        alertBox.style.display = 'none';
    }
}

function eliminarProducto(id) {
    if (confirm('¿Eliminar producto?')) {
        productos = productos.filter(p => p.id_producto !== id);
        guardarEnLocalStorage();
        actualizarTodo();
    }
}

function actualizarTodo() {
    cargarProductos();
    cargarAlertas();
    cargarMovimientos();
}
