/**
 * Caja Admin - J & B
 * Muestra las ventas del día (o de una fecha elegida).
 * Solo accesible para admin y trabajador.
 */

const sesion = exigirLogin(["admin", "trabajador"]);

function fechaLocalISO(date) {
  const d = date || new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function esMismaFecha(isoDate, ymd) {
  if (!isoDate) return false;
  const d = new Date(isoDate);
  return fechaLocalISO(d) === ymd;
}

async function cargarVentas(ymd) {
  const tbody = document.getElementById("tabla-ventas");
  const totalDia = document.getElementById("total-dia");
  if (!tbody) return;

  tbody.innerHTML =
    '<tr><td colspan="5" style="text-align:center; padding:30px; color:#666;">Cargando ventas...</td></tr>';

  try {
    const respuesta = await fetch(`${API}api/ventas`);
    if (!respuesta.ok) throw new Error("Error al obtener ventas");

    const todas = await respuesta.json();
    const ventasFiltradas = (todas || []).filter(function (v) {
      return esMismaFecha(v.createdAt, ymd);
    });

    if (ventasFiltradas.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align:center; padding:30px; color:#666;">No hay ventas en esta fecha.</td></tr>';
      if (totalDia) totalDia.textContent = "$0";
      return;
    }

    let suma = 0;
    tbody.innerHTML = "";

    ventasFiltradas.forEach(function (v) {
      suma += Number(v.total) || 0;
      const fecha = new Date(v.createdAt).toLocaleString("es-CO");
      const numItems = v.items && Array.isArray(v.items) ? v.items.length : 0;

      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td><strong>#" +
        v.id +
        "</strong></td>" +
        "<td>" +
        fecha +
        "</td>" +
        "<td>" +
        numItems +
        " producto(s)</td>" +
        "<td>$" +
        Number(v.total).toLocaleString("es-CO") +
        "</td>" +
        '<td><button class="btn-editar btn-detalle" data-id="' +
        v.id +
        '">Ver</button></td>';
      tbody.appendChild(tr);
    });

    if (totalDia) {
      totalDia.textContent = "$" + suma.toLocaleString("es-CO");
    }

    document.querySelectorAll(".btn-detalle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        verDetalle(parseInt(btn.dataset.id, 10), ventasFiltradas);
      });
    });
  } catch (error) {
    console.error(error);
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align:center; color:red; padding:30px;">Error al cargar ventas.</td></tr>';
    if (totalDia) totalDia.textContent = "$0";
  }
}

function verDetalle(id, ventas) {
  const venta = ventas.find(function (v) {
    return v.id === id;
  });
  if (!venta) return;

  const contenedor = document.getElementById("contenido-detalle");
  if (!contenedor) return;

  const fecha = new Date(venta.createdAt).toLocaleString("es-CO");

  let html =
    '<div style="text-align:center; margin-bottom:15px;">' +
    '<strong style="font-size:18px;">J &amp; B</strong><br>' +
    '<span style="font-size:13px; color:#666;">Ticket #' +
    venta.id +
    "</span>" +
    "</div>" +
    '<div style="border-top:1px dashed #ccc; border-bottom:1px dashed #ccc; padding:10px 0; margin-bottom:15px; font-size:13px;">' +
    fecha +
    "</div>";

  (venta.items || []).forEach(function (item) {
    html +=
      '<div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:14px;">' +
      "<span>" +
      item.nombre +
      " x" +
      item.cantidad +
      "</span>" +
      "<span>$" +
      Number(item.subtotal).toLocaleString("es-CO") +
      "</span>" +
      "</div>";
  });

  html +=
    '<div style="border-top:1px dashed #ccc; padding-top:10px; display:flex; justify-content:space-between; font-size:16px; font-weight:bold;">' +
    "<span>TOTAL</span>" +
    "<span>$" +
    Number(venta.total).toLocaleString("es-CO") +
    "</span>" +
    "</div>";

  contenedor.innerHTML = html;
  document.getElementById("modal-detalle").classList.remove("hidden");
}

function cerrarDetalle() {
  const modal = document.getElementById("modal-detalle");
  if (modal) modal.classList.add("hidden");
}

// ---- Inicialización ----
document.addEventListener("DOMContentLoaded", function () {
  const inputFecha = document.getElementById("filtro-fecha");
  const btnHoy = document.getElementById("btn-hoy");
  const btnRecargar = document.getElementById("btn-recargar");
  const btnSalir = document.getElementById("btn-salir");
  const btnCerrar1 = document.getElementById("btn-cerrar-detalle");
  const btnCerrar2 = document.getElementById("btn-cerrar-detalle-2");

  const hoy = fechaLocalISO();
  if (inputFecha) {
    inputFecha.value = hoy;
    inputFecha.addEventListener("change", function () {
      cargarVentas(inputFecha.value || hoy);
    });
  }

  if (btnHoy) {
    btnHoy.addEventListener("click", function () {
      if (inputFecha) inputFecha.value = hoy;
      cargarVentas(hoy);
    });
  }

  if (btnRecargar) {
    btnRecargar.addEventListener("click", function () {
      const ymd = (inputFecha && inputFecha.value) || hoy;
      cargarVentas(ymd);
    });
  }

  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      cerrarSesion();
    });
  }

  if (btnCerrar1) btnCerrar1.addEventListener("click", cerrarDetalle);
  if (btnCerrar2) btnCerrar2.addEventListener("click", cerrarDetalle);

  const modal = document.getElementById("modal-detalle");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) cerrarDetalle();
    });
  }

  cargarVentas(hoy);
});
