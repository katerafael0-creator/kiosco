const API_URL = './api';

document.addEventListener('DOMContentLoaded', () => {
    actualizarTodo();

    const formProducto = document.getElementById('form-producto');
    if (formProducto) formProducto.addEventListener('submit', agregarProducto);

    const formMovimiento = document.getElementById('form-movimiento');
    if (formMovimiento) formMovimiento.addEventListener('submit', registrarMovimiento);
});

async function cargarProductos() {
    try {
        const res = await fetch(`${API_URL}/productos.php`);
        const productos = await res.json();
        const tbody = document.getElementById('tabla-productos');
        const selectMov = document.getElementById('select-producto-mov');

        if (tbody) tbody.innerHTML = '';
        if (selectMov) selectMov.innerHTML = '<option value="">Seleccionar producto</option>';

        if (Array.isArray(productos)) {
            productos.forEach(p => {
                if (tbody) {
                    tbody.innerHTML += `
                        <tr>
                            <td>${p.id_producto}</td>
                            <td>${p.nombre}</td>
                            <td>Bs. ${parseFloat(p.precio_venta).toFixed(2)}</td>
                            <td><strong>${p.stock}</strong></td>
                            <td><button class="btn-delete" onclick="eliminarProducto(${p.id_producto})">Eliminar</button></td>
                        </tr>`;
                }
                if (selectMov) {
                    selectMov.innerHTML += `<option value="${p.id_producto}">${p.nombre} (Stock actual: ${p.stock})</option>`;
                }
            });
        }
    } catch (e) {
        console.error('Error productos:', e);
    }
}

async function cargarMovimientos() {
    try {
        const res = await fetch(`${API_URL}/movimientos.php`);
        const movimientos = await res.json();
        const tbody = document.getElementById('tabla-movimientos');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (Array.isArray(movimientos) && movimientos.length > 0) {
            movimientos.forEach(m => {
                const esEntrada = m.tipo_movimiento === 'Entrada';
                const color = esEntrada ? '#15803d' : '#b91c1c';

                tbody.innerHTML += `
                    <tr>
                        <td>${m.id_movimiento}</td>
                        <td>${m.fecha}</td>
                        <td>${m.producto || 'Producto sin nombre'}</td>
                        <td><strong style="color: ${color}">${m.tipo_movimiento}</strong></td>
                        <td>${m.cantidad}</td>
                    </tr>`;
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748b;">No hay movimientos registrados aún.</td></tr>`;
        }
    } catch (e) {
        console.error('Error movimientos:', e);
    }
}

async function registrarMovimiento(e) {
    e.preventDefault();
    const data = {
        id_producto: document.getElementById('select-producto-mov').value,
        tipo_movimiento: document.getElementById('tipo_movimiento').value,
        cantidad: document.getElementById('cantidad_mov').value
    };

    try {
        const res = await fetch(`${API_URL}/movimientos.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const respuesta = await res.json();

        if (respuesta.success) {
            document.getElementById('form-movimiento').reset();
            actualizarTodo();
        } else {
            alert('Error: ' + (respuesta.error || 'No se pudo guardar'));
        }
    } catch (e) {
        alert('Error de conexión');
    }
}

async function agregarProducto(e) {
    e.preventDefault();
    const data = {
        nombre: document.getElementById('nombre').value,
        precio_compra: document.getElementById('precio_compra').value,
        precio_venta: document.getElementById('precio_venta').value,
        stock: document.getElementById('stock').value,
        stock_minimo: document.getElementById('stock_minimo').value,
        id_categoria: 1
    };

    await fetch(`${API_URL}/productos.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    document.getElementById('form-producto').reset();
    actualizarTodo();
}

async function cargarAlertas() {
    try {
        const res = await fetch(`${API_URL}/productos.php?alertas=true`);
        const alertas = await res.json();
        const alertBox = document.getElementById('alert-box');
        const alertList = document.getElementById('alert-list');

        if (alertBox && alertList && Array.isArray(alertas) && alertas.length > 0) {
            alertList.innerHTML = alertas.map(a => `<li><strong>${a.nombre}</strong> - Stock: ${a.stock} (Mínimo: ${a.stock_minimo})</li>`).join('');
            alertBox.style.display = 'block';
        } else if (alertBox) {
            alertBox.style.display = 'none';
        }
    } catch (e) {
        console.error('Error alertas:', e);
    }
}

async function eliminarProducto(id) {
    if (confirm('¿Eliminar producto?')) {
        await fetch(`${API_URL}/productos.php?id=${id}`, { method: 'DELETE' });
        actualizarTodo();
    }
}

function actualizarTodo() {
    cargarProductos();
    cargarAlertas();
    cargarMovimientos();
}
