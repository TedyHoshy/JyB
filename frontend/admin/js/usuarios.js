// Caja - solo admin y trabajador
const sesion = exigirLogin(["admin", "trabajador"]);

const API_VENTAS = "https://jyb-production.up.railway.app/api/ventas";

// ============================================
// CARGAR VENTAS DEL DIA
// ============================================
async function cargarVentas() {
  const tbody = document.getElementById("tabla-ventas");
  const totalDia = document.getElementById("total-dia");
  if (!tbody) return;

  try {
    const res = await fetch(API_VENTAS);
    const ventas = await res.json();

    // Fecha de hoy en hora local (Colombia)
    const ahora = new Date();
    const hoyStr = ahora.toLocaleDateString("en-CA"); // YYYY-MM-DD

    // Filtrar ventas de hoy
    const ventasHoy = ventas.filter(function (v) {
      const fechaVenta = new Date(v.createdAt);
      const fechaStr = fechaVenta.toLocaleDateString("en-CA");
      return fechaStr === hoyStr;
    });

    tbody.innerHTML = "";
    var suma = 0;

    if (ventasHoy.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align:center; padding:30px; color:#666;">No hay ventas hoy.</td></tr>';
      if (totalDia) totalDia.textContent = "$0";
      return;
    }

    ventasHoy.forEach(function (v) {
      suma += Number(v.total);

      var fecha = new Date(v.createdAt);
      var hora = fecha.toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      var items = v.items ? v.items.length : 0;

      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>#" + v.id + "</td>" +
        "<td>" + hora + "</td>" +
        "<td>" + items + "</td>" +
        "<td>$" + Number(v.total).toLocaleString("es-CO") + "</td>" +
        '<td><button class="btn-detalle" data-id="' + v.id + '">Ver</button></td>';
      tbody.appendChild(tr);
    });

    if (totalDia) {
      totalDia.textContent = "$" + suma.toLocaleString("es-CO");
    }

    // Botones Ver detalle
    document.querySelectorAll(".btn-detalle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = parseInt(btn.dataset.id);
        var venta = ventasHoy.find(function (v) { return v.id === id; });
        if (venta) mostrarDetalle(venta);
      });
    });

  } catch (error) {
    console.error(error);
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align:center; color:red; padding:30px;">Error al cargar ventas.</td></tr>';
  }
}

// ============================================
// MOSTRAR DETALLE
// ============================================
function mostrarDetalle(venta) {
  var texto = "Boleto #" + venta.id + "\n";
  texto += "Total: $" + Number(venta.total).toLocaleString("es-CO") + "\n\n";

  if (venta.items && venta.items.length) {
    venta.items.forEach(function (item) {
      texto +=
        item.nombre +
        " x" + item.cantidad +
        " = $" + Number(item.subtotal).toLocaleString("es-CO") +
        "\n";
    });
  }

  alert(texto);
}

// ============================================
// EVENTOS
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  cargarVentas();

  var btnSalir = document.getElementById("btn-salir");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      localStorage.removeItem("sesion");
      window.location.href = "../index.html";
    });
  }
});