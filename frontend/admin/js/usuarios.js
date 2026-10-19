// Solo Admin puede entrar
const sesion = exigirLogin(["admin"]);

const API_USUARIOS = `${API}api/usuarios`;

// ============================================
// CARGAR USUARIOS
// ============================================
async function cargarUsuarios() {
  const tbody = document.getElementById("tabla-usuarios");
  if (!tbody) return;

  try {
    const res = await fetch(API_USUARIOS);
    const usuarios = await res.json();

    tbody.innerHTML = "";

    if (usuarios.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding:30px; color:#666;">
            No hay usuarios registrados.
          </td>
        </tr>`;
      return;
    }

    usuarios.forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${u.nombre}</td>
        <td>${u.correo}</td>
        <td><strong>${u.rol}</strong></td>
        <td class="acciones">
          <button class="btn-eliminar" data-id="${u.id}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Eventos eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", () => eliminarUsuario(parseInt(btn.dataset.id)));
    });

  } catch (error) {
    console.error(error);
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; color:red; padding:30px;">
          Error al cargar usuarios. ¿Está corriendo la API?
        </td>
      </tr>`;
  }
}

// ============================================
// ABRIR MODAL NUEVO
// ============================================
function abrirModalUsuario() {
  document.getElementById("titulo-modal-usuario").textContent = "Nuevo Usuario";
  document.getElementById("form-usuario").reset();
  document.getElementById("usuario-id").value = "";
  document.getElementById("modal-usuario").classList.remove("hidden");
}

// ============================================
// CERRAR MODAL
// ============================================
function cerrarModalUsuario() {
  document.getElementById("modal-usuario").classList.add("hidden");
}

// ============================================
// ELIMINAR USUARIO
// ============================================
async function eliminarUsuario(id) {
  if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

  try {
    const res = await fetch(`${API_USUARIOS}/${id}`, { method: "DELETE" });
    if (res.ok) {
      cargarUsuarios();
    } else {
      alert("Error al eliminar");
    }
  } catch (error) {
    alert("Error de conexión");
  }
}

// ============================================
// GUARDAR USUARIO
// ============================================
async function guardarUsuario(e) {
  e.preventDefault();

  const data = {
    nombre: document.getElementById("nombre-usuario").value.trim(),
    correo: document.getElementById("correo-usuario").value.trim().toLowerCase(),
    clave: document.getElementById("clave-usuario").value,
    rol: document.getElementById("rol-usuario").value
  };

  if (data.clave.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres");
    return;
  }

  try {
    const res = await fetch(API_USUARIOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      cerrarModalUsuario();
      cargarUsuarios();
    } else {
      const error = await res.json();
      alert(error.error || "Error al guardar");
    }
  } catch (error) {
    alert("Error de conexión");
  }
}

// ============================================
// EVENTOS
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();

  document.getElementById("btn-nuevo-usuario").addEventListener("click", abrirModalUsuario);
  document.getElementById("btn-cerrar-usuario").addEventListener("click", cerrarModalUsuario);
  document.getElementById("btn-cancelar-usuario").addEventListener("click", cerrarModalUsuario);
  document.getElementById("form-usuario").addEventListener("submit", guardarUsuario);

  document.getElementById("btn-salir")?.addEventListener("click", () => {
    localStorage.removeItem("sesion");
    window.location.href = "../index.html";
  });

  // Cerrar modal al hacer clic fuera
  document.getElementById("modal-usuario").addEventListener("click", (e) => {
    if (e.target.id === "modal-usuario") cerrarModalUsuario();
  });
});