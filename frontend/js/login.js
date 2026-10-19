document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const mensaje = document.getElementById("mensaje");

  // Si ya hay sesión, redirigir
  const sesion = JSON.parse(localStorage.getItem("sesion"));
  if (sesion) {
    redirigirSegunRol(sesion.rol);
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const clave = document.getElementById("clave").value;

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, clave })
      });

      const data = await res.json();

      if (res.ok) {
        // Guardar sesión
        localStorage.setItem("sesion", JSON.stringify({
          id: data.id,
          nombre: data.nombre,
          correo: data.correo,
          rol: data.rol
        }));

        redirigirSegunRol(data.rol);
      } else {
        mensaje.textContent = data.error || "Correo o contraseña incorrectos";
        mensaje.style.color = "#c0392b";
      }
    } catch (error) {
      mensaje.textContent = "Error de conexión. ¿Está corriendo la API?";
      mensaje.style.color = "#c0392b";
    }
  });
});

function redirigirSegunRol(rol) {
  if (rol === "admin") {
    window.location.href = "admin/admin.html";
  } else if (rol === "trabajador") {
    window.location.href = "minimercado/tienda.html";
  } else {
    // usuario (cliente)
    window.location.href = "minimercado/tienda.html";
  }
}