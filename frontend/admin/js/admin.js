// Proteger la página (solo admin)
const sesion = exigirLogin(["admin"]);

const API = "http://localhost:3000/api/productos";

// ============================================
// CARGAR PRODUCTOS EN LA TABLA
// ============================================
async function cargarProductos() {
  const tbody = document.getElementById("tabla-body");
  if (!tbody) return;

  try {
    const res = await fetch(API);
    const productos = await res.json();

    tbody.innerHTML = "";

    if (productos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:30px; color:#666;">
            No hay productos. Agrega el primero.
          </td>
        </tr>`;
      return;
    }

    productos.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>$${p.precio.toLocaleString("es-CO")}</td>
        <td>${p.stock}</td>
        <td>${p.categoria}</td>
        <td class="acciones">
          <button class="btn-editar" data-id="${p.id}">Editar</button>
          <button class="btn-eliminar" data-id="${p.id}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Eventos de los botones
    document.querySelectorAll(".btn-editar").forEach(btn => {
      btn.addEventListener("click", () => editarProducto(parseInt(btn.dataset.id)));
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", () => eliminarProducto(parseInt(btn.dataset.id)));
    });

  } catch (error) {
    console.error(error);
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; color:red; padding:30px;">
          Error al cargar productos. ¿Está corriendo la API?
        </td>
      </tr>`;
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
    const res = await fetch(`${API}/${id}`);
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
  if (!confirm("¿Seguro que quieres eliminar este producto?")) return;

  try {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (res.ok) {
      cargarProductos();
    } else {
      alert("Error al eliminar");
    }
  } catch (error) {
    alert("Error de conexión");
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
    precio: document.getElementById("precio").value,
    stock: document.getElementById("stock").value,
    categoria: document.getElementById("categoria").value,
    foto: document.getElementById("foto").value || "sin-foto.jpg"
  };

  try {
    let res;
    if (id) {
      // Actualizar
      res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    } else {
      // Crear
      res = await fetch(API, {
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
    alert("Error de conexión");
  }
}

// ============================================
// EVENTOS
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();

  document.getElementById("btn-nuevo").addEventListener("click", abrirModalNuevo);
  document.getElementById("btn-cerrar-form").addEventListener("click", cerrarModal);
  document.getElementById("btn-cancelar").addEventListener("click", cerrarModal);
  document.getElementById("form-producto").addEventListener("submit", guardarProducto);

  // Cerrar modal al hacer clic fuera
  document.getElementById("modal-form").addEventListener("click", (e) => {
    if (e.target.id === "modal-form") cerrarModal();
  });
});

const btnSalir = document.getElementById("btn-salir");
if (btnSalir) {
  btnSalir.addEventListener("click", cerrarSesion);
}