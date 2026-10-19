// Solo trabajador y admin
const sesion = exigirLogin(["admin", "trabajador"]);

document.addEventListener("DOMContentLoaded", () => {
  // Mostrar nombre
  const span = document.getElementById("nombre-usuario");
  if (span && sesion) {
    span.textContent = sesion.nombre + (sesion.rol === "trabajador" ? " (Trabajador)" : " (Admin)");
  }

  cargarVentas();

  document.getElementById("btn-salir")?.addEventListener("click", () => {
    localStorage.removeItem("sesion");
    window.location.href = "../index.html";
  });

  document.getElementById("btn-cerrar-detalle")?.addEventListener("click", cerrarDetalle);
  document.getElementById("btn-cerrar-detalle-2")?.addEventListener("click", cerrarDetalle);
  document.getElementById("modal-detalle")?.addEventListener("click", (e) => {
    if (e.target.id === "modal-detalle") cerrarDetalle();
  });
});

async function cargarVentas() {
  const tbody = document.getElementById("tabla-ventas");
  const totalDia = document.getElementById("total-dia");
  if (!tbody) return;

  try {
    const res = await fetch("http://localhost:3000/api/ventas");
    const ventas = await res.json();

    // Filtrar solo las de hoy
    const hoy = new Date().toDateString();
    const ventasHoy = ventas.filter(v => new Date(v.createdAt).toDateString() === hoy);

    tbody.innerHTML = "";

    if (ventasHoy.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding:30px; color:#666;">
            No hay ventas hoy todavía.
          </td>
        </tr>`;
      totalDia.textContent = "$0";
      return;
    }

    let suma = 0;

    ventasHoy.forEach(v => {
      suma += v.total;
      const fecha = new Date(v.createdAt).toLocaleString("es-CO");
      const numItems = v.items ? v.items.length : 0;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>#${v.id}</strong></td>
        <td>${fecha}</td>
        <td>${numItems} producto(s)</td>
        <td>$${v.total.toLocaleString("es-CO")}</td>
        <td>
          <button class="btn-editar btn-detalle" data-id="${v.id}">Ver</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    totalDia.textContent = "$" + suma.toLocaleString("es-CO");

    document.querySelectorAll(".btn-detalle").forEach(btn => {
      btn.addEventListener("click", () => verDetalle(parseInt(btn.dataset.id), ventasHoy));
    });

  } catch (error) {
    console.error(error);
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; color:red; padding:30px;">
          Error al cargar ventas. ¿Está corriendo la API?
        </td>
      </tr>`;
  }
}

function verDetalle(id, ventas) {
  const venta = ventas.find(v => v.id === id);
  if (!venta) return;

  const contenedor = document.getElementById("contenido-detalle");
  const fecha = new Date(venta.createdAt).toLocaleString("es-CO");

  let html = `
    <div style="text-align:center; margin-bottom:15px;">
      <strong style="font-size:18px;">J & B</strong><br>
      <span style="font-size:13px; color:#666;">Ticket #${venta.id}</span>
    </div>
    <div style="border-top:1px dashed #ccc; border-bottom:1px dashed #ccc; padding:10px 0; margin-bottom:15px; font-size:13px;">
      ${fecha}
    </div>
  `;

  (venta.items || []).forEach(item => {
    html += `
      <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:14px;">
        <span>${item.nombre} x${item.cantidad}</span>
        <span>$${item.subtotal.toLocaleString("es-CO")}</span>
      </div>
    `;
  });

  html += `
    <div style="border-top:1px dashed #ccc; padding-top:10px; display:flex; justify-content:space-between; font-size:16px; font-weight:bold;">
      <span>TOTAL</span>
      <span>$${venta.total.toLocaleString("es-CO")}</span>
    </div>
  `;

  contenedor.innerHTML = html;
  document.getElementById("modal-detalle").classList.remove("hidden");
}

function cerrarDetalle() {
  document.getElementById("modal-detalle")?.classList.add("hidden");
}