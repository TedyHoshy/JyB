// ============================================
// CARRITO COMPARTIDO (Mini Mercado + Carnicería + Admin)
// ============================================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Guardar carrito
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Actualizar contador del botón
function actualizarContadorCarrito() {
  const btn = document.getElementById("btn-carrito");
  if (!btn) return;
  const total = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  btn.textContent = `Carrito (${total})`;
}

// Agregar producto al carrito
function agregarAlCarrito(id, productos) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  const item = carrito.find(p => p.id === id);

  if (item) {
    item.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      foto: producto.foto,
      cantidad: 1
    });
  }

  guardarCarrito();
  actualizarContadorCarrito();
  alert(`${producto.nombre} agregado al carrito`);
}

// Abrir / cerrar modal
function abrirCarrito() {
  const modal = document.getElementById("modal-carrito");
  if (modal) {
    modal.classList.remove("hidden");
    pintarCarrito();
  }
}

function cerrarCarrito() {
  const modal = document.getElementById("modal-carrito");
  if (modal) modal.classList.add("hidden");
}

// Pintar contenido del carrito
function pintarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("total-carrito");
  if (!lista || !totalSpan) return;

  if (carrito.length === 0) {
    lista.innerHTML = `<p style="text-align:center; color:#666; padding:30px 0;">Tu carrito está vacío</p>`;
    totalSpan.textContent = "0";
    return;
  }

  lista.innerHTML = "";
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "item-carrito";

    div.innerHTML = `
      <div class="info">
        <div class="nombre">${item.nombre}</div>
        <div class="precio-unitario">$${item.precio.toLocaleString("es-CO")} c/u</div>
      </div>
      <div class="controles">
        <button class="btn-menos" data-id="${item.id}">−</button>
        <span class="cantidad">${item.cantidad}</span>
        <button class="btn-mas" data-id="${item.id}">+</button>
      </div>
      <div class="subtotal">$${subtotal.toLocaleString("es-CO")}</div>
    `;

    lista.appendChild(div);
  });

  totalSpan.textContent = total.toLocaleString("es-CO");

  // Botones + y −
  document.querySelectorAll(".btn-mas").forEach(btn => {
    btn.addEventListener("click", () => cambiarCantidad(parseInt(btn.dataset.id), 1));
  });

  document.querySelectorAll(".btn-menos").forEach(btn => {
    btn.addEventListener("click", () => cambiarCantidad(parseInt(btn.dataset.id), -1));
  });
}

// Cambiar cantidad
function cambiarCantidad(id, cambio) {
  const item = carrito.find(p => p.id === id);
  if (!item) return;

  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    carrito = carrito.filter(p => p.id !== id);
  }

  guardarCarrito();
  actualizarContadorCarrito();
  pintarCarrito();
}

// Vaciar carrito
function vaciarCarrito() {
  if (carrito.length === 0) return;
  if (confirm("¿Seguro que quieres vaciar el carrito?")) {
    carrito = [];
    guardarCarrito();
    actualizarContadorCarrito();
    pintarCarrito();
  }
}

// ============================================
// PAGAR (con ticket y guardado en BD)
// ============================================
async function pagar() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  // Calcular total
  const total = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);

  // Resumen antes de confirmar
  let resumen = "¿Confirmas la compra?\n\n";
  carrito.forEach(item => {
    resumen += `• ${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toLocaleString("es-CO")}\n`;
  });
  resumen += `\nTotal: $${total.toLocaleString("es-CO")}`;

  if (!confirm(resumen)) return;

  try {
    // Preparar items para la API
    const items = carrito.map(item => ({
      productoId: item.id,
      nombre: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad,
      subtotal: item.precio * item.cantidad
    }));

    // Obtener usuario de la sesión (si existe)
    const sesion = JSON.parse(localStorage.getItem("sesion"));
    const usuarioId = sesion ? sesion.id : null;

    // Enviar venta a la API
    const res = await fetch("http://localhost:3000/api/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        total,
        usuarioId,
        items
      })
    });

    if (!res.ok) {
      throw new Error("Error al guardar la venta");
    }

    const venta = await res.json();

    // Vaciar carrito
    carrito = [];
    guardarCarrito();
    actualizarContadorCarrito();
    cerrarCarrito();

    // Mostrar ticket
    mostrarTicket(venta);

    // Recargar productos (para ver stock actualizado)
    if (typeof pintarProductos === "function") {
      if (typeof todosLosProductos !== "undefined") {
        todosLosProductos = [];
      }
      pintarProductos();
    }

  } catch (error) {
    console.error(error);
    alert("Error al procesar la compra. ¿Está corriendo la API?");
  }
}

// ============================================
// MOSTRAR TICKET
// ============================================
function mostrarTicket(venta) {
  const contenedor = document.getElementById("contenido-ticket");
  if (!contenedor) {
    alert(`✅ Venta #${venta.id} realizada\nTotal: $${venta.total.toLocaleString("es-CO")}`);
    return;
  }

  const fecha = new Date(venta.createdAt).toLocaleString("es-CO");

  let html = `
    <div style="text-align:center; margin-bottom:15px;">
      <strong style="font-size:18px;">J & B</strong><br>
      <span style="font-size:13px; color:#666;">Mini Mercado & Carnicería</span>
    </div>
    <div style="border-top:1px dashed #ccc; border-bottom:1px dashed #ccc; padding:10px 0; margin-bottom:15px; font-size:13px;">
      <div><strong>Ticket #${venta.id}</strong></div>
      <div>${fecha}</div>
    </div>
    <div style="margin-bottom:15px;">
  `;

  venta.items.forEach(item => {
    html += `
      <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:14px;">
        <span>${item.nombre} x${item.cantidad}</span>
        <span>$${item.subtotal.toLocaleString("es-CO")}</span>
      </div>
    `;
  });

  html += `
    </div>
    <div style="border-top:1px dashed #ccc; padding-top:10px; display:flex; justify-content:space-between; font-size:16px; font-weight:bold;">
      <span>TOTAL</span>
      <span>$${venta.total.toLocaleString("es-CO")}</span>
    </div>
    <div style="text-align:center; margin-top:20px; font-size:13px; color:#666;">
      ¡Gracias por su compra!
    </div>
  `;

  contenedor.innerHTML = html;

  // Mostrar modal
  document.getElementById("modal-ticket").classList.remove("hidden");
}

// Cerrar ticket
function cerrarTicket() {
  document.getElementById("modal-ticket")?.classList.add("hidden");
}

// ============================================
// INICIALIZAR EVENTOS DEL CARRITO
// ============================================
function iniciarCarrito() {
  actualizarContadorCarrito();

  document.getElementById("btn-carrito")?.addEventListener("click", abrirCarrito);
  document.getElementById("btn-cerrar-carrito")?.addEventListener("click", cerrarCarrito);
  document.getElementById("btn-vaciar")?.addEventListener("click", vaciarCarrito);
  document.getElementById("btn-pagar")?.addEventListener("click", pagar);

  // Cerrar modal carrito al hacer clic fuera
  document.getElementById("modal-carrito")?.addEventListener("click", (e) => {
    if (e.target.id === "modal-carrito") cerrarCarrito();
  });

  // Cerrar ticket
  document.getElementById("btn-cerrar-ticket")?.addEventListener("click", cerrarTicket);
  document.getElementById("btn-cerrar-ticket-2")?.addEventListener("click", cerrarTicket);

  document.getElementById("modal-ticket")?.addEventListener("click", (e) => {
    if (e.target.id === "modal-ticket") cerrarTicket();
  });
}