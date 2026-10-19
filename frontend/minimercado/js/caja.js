// Solo trabajador y admin
const sesion = exigirLogin(["admin", "trabajador"]);

const API_VENTAS = "https://jyb-production.up.railway.app/api/ventas";

document.addEventListener("DOMContentLoaded", function () {
  // Proteger DESPUES de cargar el DOM
  var sesion = null;
  if (typeof exigirLogin === "function") {
    sesion = exigirLogin(["admin", "trabajador"]);
  }

  var span = document.getElementById("nombre-usuario");
  if (span && sesion) {
    span.textContent =
      sesion.nombre +
      (sesion.rol === "trabajador" ? " (Trabajador)" : " (Admin)");
  }

  cargarVentas();

  var btnSalir = document.getElementById("btn-salir");
  if (btnSalir) {
    btnSalir.onclick = function () {
      localStorage.removeItem("sesion");
      window.location.href = "../index.html";
    };
  }

  document.getElementById("btn-cerrar-detalle")?.addEventListener("click", cerrarDetalle);
  document.getElementById("btn-cerrar-detalle-2")?.addEventListener("click", cerrarDetalle);

  document.getElementById("modal-detalle")?.addEventListener("click", function (e) {
    if (e.target.id === "modal-detalle") cerrarDetalle();
  });
});

async function cargarVentas() {
  var tbody = document.getElementById("tabla-ventas");
  var totalDia = document.getElementById("total-dia");
  if (!tbody) return;

  try {
    var res = await fetch(API_VENTAS);
    var ventas = await res.json();

    var hoy = new Date().toDateString();
    var ventasHoy = ventas.filter(function (v) {
      return new Date(v.createdAt).toDateString() === hoy;
    });

    tbody.innerHTML = "";

    if (ventasHoy.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align:center; padding:30px; color:#666;">No hay ventas hoy todavia.</td></tr>';
      if (totalDia) totalDia.textContent = "$0";
      return;
    }

    var suma = 0;

    ventasHoy.forEach(function (v) {
      suma += Number(v.total);
      var fecha = new Date(v.createdAt).toLocaleString("es-CO");
      var numItems = v.items ? v.items.length : 0;

      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td><strong>#" + v.id + "</strong></td>" +
        "<td>" + fecha + "</td>" +
        "<td>" + numItems + " producto(s)</td>" +
        "<td>$" + Number(v.total).toLocaleString("es-CO") + "</td>" +
        '<td><button class="btn-editar btn-detalle" data-id="' + v.id + '">Ver</button></td>';
      tbody.appendChild(tr);
    });

    if (totalDia) {
      totalDia.textContent = "$" + suma.toLocaleString("es-CO");
    }

    document.querySelectorAll(".btn-detalle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        verDetalle(parseInt(btn.dataset.id), ventasHoy);
      });
    });
  } catch (error) {
    console.error(error);
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align:center; color:red; padding:30px;">Error al cargar ventas.</td></tr>';
  }
}

function verDetalle(id, ventas) {
  var venta = ventas.find(function (v) {
    return v.id === id;
  });
  if (!venta) return;

  var contenedor = document.getElementById("contenido-detalle");
  if (!contenedor) return;

  var fecha = new Date(venta.createdAt).toLocaleString("es-CO");

  var html =
    '<div style="text-align:center; margin-bottom:15px;">' +
      '<strong style="font-size:18px;">J & B</strong><br>' +
      '<span style="font-size:13px; color:#666;">Ticket #' + venta.id + "</span>" +
    "</div>" +
    '<div style="border-top:1px dashed #ccc; border-bottom:1px dashed #ccc; padding:10px 0; margin-bottom:15px; font-size:13px;">' +
      fecha +
    "</div>";

  (venta.items || []).forEach(function (item) {
    html +=
      '<div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:14px;">' +
        "<span>" + item.nombre + " x" + item.cantidad + "</span>" +
        "<span>$" + Number(item.subtotal).toLocaleString("es-CO") + "</span>" +
      "</div>";
  });

  html +=
    '<div style="border-top:1px dashed #ccc; padding-top:10px; display:flex; justify-content:space-between; font-size:16px; font-weight:bold;">' +
      "<span>TOTAL</span>" +
      "<span>$" + Number(venta.total).toLocaleString("es-CO") + "</span>" +
    "</div>";

  contenedor.innerHTML = html;
  document.getElementById("modal-detalle").classList.remove("hidden");
}

function cerrarDetalle() {
  var modal = document.getElementById("modal-detalle");
  if (modal) modal.classList.add("hidden");
}