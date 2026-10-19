// ============================================
// PROTECCIÓN DE SESIÓN
// ============================================
const sesion = exigirLogin(["admin", "trabajador", "usuario"]);

// ============================================
// PRODUCTOS
// ============================================
let todosLosProductos = [];

async function pintarProductos(categoria = "todos") {
  const grid = document.getElementById("productos-grid");
  if (!grid) return;

  try {
    // Solo pedimos a la API la primera vez
    if (todosLosProductos.length === 0) {
      const respuesta = await fetch(`${API}api/productos`);
      todosLosProductos = await respuesta.json();
    }

    // Filtrar por categoría
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

      const sinStock = producto.stock <= 0;

      tarjeta.innerHTML = `
        <img src="../img/minimercado/${producto.foto}"
             alt="${producto.nombre}"
             onerror="this.style.display='none'">
        <h3>${producto.nombre}</h3>
        <p class="precio">$${producto.precio.toLocaleString("es-CO")}</p>
        <p class="stock">${sinStock ? "Agotado" : "Stock: " + producto.stock}</p>
        <button class="btn-agregar" data-id="${producto.id}" ${sinStock ? "disabled" : ""}>
          ${sinStock ? "Agotado" : "Agregar"}
        </button>
      `;

      grid.appendChild(tarjeta);
    });

    // Botones Agregar (solo los que no están disabled)
    document.querySelectorAll(".btn-agregar:not([disabled])").forEach(boton => {
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
// EVENTOS
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Iniciar carrito (viene de carrito.js)
  iniciarCarrito();

  // Cargar productos
  pintarProductos();

  // Botón Salir
  document.getElementById("btn-salir")?.addEventListener("click", () => {
    localStorage.removeItem("sesion");
    window.location.href = "../index.html";
  });

  // Mostrar botón Caja solo a trabajador y admin
  const btnCaja = document.getElementById("btn-caja");
  if (btnCaja && sesion && (sesion.rol === "trabajador" || sesion.rol === "admin")) {
    btnCaja.style.display = "inline";
  }

  // Filtros
  document.querySelectorAll(".filtro-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("activo"));
      btn.classList.add("activo");
      pintarProductos(btn.dataset.categoria);
    });
  });
});