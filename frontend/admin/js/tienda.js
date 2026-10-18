// ============================================
// PROTECCIÓN - Solo Admin
// ============================================
const sesion = exigirLogin(["admin"]);

// ============================================
// CARRITO
// ============================================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let todosLosProductos = [];

// ============================================
// PINTAR PRODUCTOS
// ============================================
async function pintarProductos(categoria = "todos") {
  const grid = document.getElementById("productos-grid");
  if (!grid) return;

  try {
    if (todosLosProductos.length === 0) {
      const respuesta = await fetch("http://localhost:3000/api/productos");
      todosLosProductos = await respuesta.json();
    }

    let productos = todosLosProductos;
    if (categoria !== "todos") {
      productos = todosLosProductos.filter(p => p.categoria === categoria);
    }

    grid.innerHTML = "";

    if (productos.length === 0) {
      grid.innerHTML = `<p style="text-align:center; padding:40px; color:#666;">No hay productos en esta categoría</p>`;
      return;
    }

    productos.forEach(producto => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta";

      tarjeta.innerHTML = `
        <img src="../img/minimercado/${producto.foto}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p class="precio">$${producto.precio.toLocaleString("es-CO")}</p>
        <p class="stock">Stock: ${producto.stock}</p>
        <button class="btn-agregar" data-id="${producto.id}">Agregar</button>
      `;

      grid.appendChild(tarjeta);
    });

    document.querySelectorAll(".btn-agregar").forEach(boton => {
      boton.addEventListener("click", () => {
        const id = parseInt(boton.dataset.id);
        agregarAlCarrito(id, todosLosProductos);
      });
    });

  } catch (error) {
    console.error("Error al cargar productos:", error);
    grid.innerHTML = `<p style="text-align:center; color:red; padding:40px;">
      Error al cargar los productos.<br>¿Está corriendo la API?
    </p>`;
  }
}

// ============================================
// CARRITO - FUNCIONES
// ============================================
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

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarContadorCarrito() {
  const btn = document.getElementById("btn-carrito");
  if (!btn) return;
  const total = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  btn.textContent = `Carrito (${total})`;
}

function abrirCarrito() {
  document.getElementById("modal-carrito").classList.remove("hidden");
  pintarCarrito();
}

function cerrarCarrito() {
  document.getElementById("modal-carrito").classList.add("hidden");
}

function pintarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("total-carrito");

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

  document.querySelectorAll(".btn-mas").forEach(btn => {
    btn.addEventListener("click", () => cambiarCantidad(parseInt(btn.dataset.id), 1));
  });

  document.querySelectorAll(".btn-menos").forEach(btn => {
    btn.addEventListener("click", () => cambiarCantidad(parseInt(btn.dataset.id), -1));
  });
}

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
// EVENTOS
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  pintarProductos();
  actualizarContadorCarrito();

  document.getElementById("btn-carrito")?.addEventListener("click", abrirCarrito);
  document.getElementById("btn-cerrar-carrito")?.addEventListener("click", cerrarCarrito);
  document.getElementById("btn-vaciar")?.addEventListener("click", vaciarCarrito);

  document.getElementById("btn-salir")?.addEventListener("click", () => {
    localStorage.removeItem("sesion");
    window.location.href = "../index.html";
  });

  // Cerrar modal al hacer clic fuera
  document.getElementById("modal-carrito")?.addEventListener("click", (e) => {
    if (e.target.id === "modal-carrito") cerrarCarrito();
  });

  // Filtros
  document.querySelectorAll(".filtro-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("activo"));
      btn.classList.add("activo");
      pintarProductos(btn.dataset.categoria);
    });
  });
});