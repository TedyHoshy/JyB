// Proteger la pagina (solo admin)
const sesion = exigirLogin(["admin"]);

// API viene de config.js
const API_PRODUCTOS = "https://jyb-production.up.railway.app/api/productos";

// ============================================
// CARGAR PRODUCTOS EN LA TABLA
// ============================================
async function cargarProductos() {
  const tbody = document.getElementById("tabla-body");
  if (!tbody) return;

  try {
    const res = await fetch(API_PRODUCTOS);
    const productos = await res.json();

    tbody.innerHTML = "";

    if (productos.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" style="text-align:center; padding:30px; color:#666;">No hay productos. Agrega el primero.</td></tr>';
      return;
    }

    productos.forEach(function (p) {
      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + p.id + "</td>" +
        "<td>" + p.nombre + "</td>" +
        "<td>$" + Number(p.precio).toLocaleString("es-CO") + "</td>" +
        "<td>" + p.stock + "</td>" +
        "<td>" + p.categoria + "</td>" +
        '<td class="acciones">' +
          '<button class="btn-editar" data-id="' + p.id + '">Editar</button> ' +
          '<button class="btn-eliminar" data-id="' + p.id + '">Eliminar</button>' +
        "</td>";
      tbody.appendChild(tr);
    });

    document.querySelectorAll(".btn-editar").forEach(function (btn) {
      btn.addEventListener("click", function () {
        editarProducto(parseInt(btn.dataset.id));
      });
    });

    document.querySelectorAll(".btn-eliminar").forEach(function (btn) {
      btn.addEventListener("click", function () {
        eliminarProducto(parseInt(btn.dataset.id));
      });
    });
  } catch (error) {
    console.error(error);
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align:center; color:red; padding:30px;">Error al cargar productos. Esta corriendo la API?</td></tr>';
  }
}

// ============================================
// ABRIR MODAL NUEVO
// ============================================
function abrirModalNuevo() {
  document.getElementById("titulo-modal").textContent = "Nuevo Producto";
  document.getElementById("form-producto").reset();
  document.getElementById("producto-id").value = "";
  document.getElementById("modal-form").classList.remove("hidden");
}

// ============================================
// CERRAR MODAL
// ============================================
function cerrarModal() {
  document.getElementById("modal-form").classList.add("hidden");
}

// ============================================
// EDITAR PRODUCTO
// ============================================
async function editarProducto(id) {
  try {
    const res = await fetch(API_PRODUCTOS + "/" + id);
    const p = await res.json();

    document.getElementById("titulo-modal").textContent = "Editar Producto";
    document.getElementById("producto-id").value = p.id;
    document.getElementById("nombre").value = p.nombre;
    document.getElementById("precio").value = p.precio;
    document.getElementById("stock").value = p.stock;
    document.getElementById("categoria").value = p.categoria;
    document.getElementById("foto").value = p.foto;

    document.getElementById("modal-form").classList.remove("hidden");
  } catch (error) {
    alert("Error al cargar el producto");
  }
}

// ============================================
// ELIMINAR PRODUCTO
// ============================================
async function eliminarProducto(id) {
  if (!confirm("Seguro que quieres eliminar este producto?")) return;

  try {
    const res = await fetch(API_PRODUCTOS + "/" + id, { method: "DELETE" });
    if (res.ok) {
      cargarProductos();
    } else {
      alert("Error al eliminar");
    }
  } catch (error) {
    alert("Error de conexion");
  }
}

// ============================================
// GUARDAR (CREAR O ACTUALIZAR)
// ============================================
async function guardarProducto(e) {
  e.preventDefault();

  const id = document.getElementById("producto-id").value;
  const data = {
    nombre: document.getElementById("nombre").value,
    precio: Number(document.getElementById("precio").value),
    stock: Number(document.getElementById("stock").value),
    categoria: document.getElementById("categoria").value,
    foto: document.getElementById("foto").value || "sin-foto.jpg"
  };

  try {
    let res;
    if (id) {
      res = await fetch(API_PRODUCTOS + "/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    } else {
      res = await fetch(API_PRODUCTOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    }

    if (res.ok) {
      cerrarModal();
      cargarProductos();
    } else {
      alert("Error al guardar");
    }
  } catch (error) {
    alert("Error de conexion");
  }
}

// ============================================
// EVENTOS
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  cargarProductos();

  var btnNuevo = document.getElementById("btn-nuevo");
  if (btnNuevo) btnNuevo.addEventListener("click", abrirModalNuevo);

  var btnCerrar = document.getElementById("btn-cerrar-form");
  if (btnCerrar) btnCerrar.addEventListener("click", cerrarModal);

  var btnCancelar = document.getElementById("btn-cancelar");
  if (btnCancelar) btnCancelar.addEventListener("click", cerrarModal);

  var form = document.getElementById("form-producto");
  if (form) form.addEventListener("submit", guardarProducto);

  var modal = document.getElementById("modal-form");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target.id === "modal-form") cerrarModal();
    });
  }

  var btnSalir = document.getElementById("btn-salir");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      if (typeof cerrarSesion === "function") {
        cerrarSesion();
      } else {
        localStorage.removeItem("sesion");
        window.location.href = "../index.html";
      }
    });
  }
});