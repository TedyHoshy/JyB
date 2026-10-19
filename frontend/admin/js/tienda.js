// Solo Admin
const sesion = exigirLogin(["admin"]);

let todosLosProductos = [];

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

    document.querySelectorAll(".btn-agregar:not([disabled])").forEach(boton => {
      boton.addEventListener("click", () => {
        const id = parseInt(boton.dataset.id);
        agregarAlCarrito(id, todosLosProductos);
      });
    });
  } catch (error) {
    console.error(error);
    grid.innerHTML = `<p style="text-align:center; color:red; padding:40px;">Error al cargar productos</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarCarrito(); // viene de carrito.js
  pintarProductos();

  // Mostrar botón Caja
  const btnCaja = document.getElementById("btn-caja");
  if (btnCaja && sesion && (sesion.rol === "admin" || sesion.rol === "trabajador")) {
    btnCaja.style.display = "inline";
  }

  document.getElementById("btn-salir")?.addEventListener("click", () => {
    localStorage.removeItem("sesion");
    window.location.href = "../index.html";
  });

  document.querySelectorAll(".filtro-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("activo"));
      btn.classList.add("activo");
      pintarProductos(btn.dataset.categoria);
    });
  });
});