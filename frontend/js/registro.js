document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-registro");
  const mensaje = document.getElementById("mensaje");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const clave = document.getElementById("clave").value;
    const clave2 = document.getElementById("clave2").value;

    // Validaciones
    if (clave.length < 6) {
      mensaje.textContent = "La contraseña debe tener al menos 6 caracteres";
      mensaje.style.color = "#c0392b";
      return;
    }

    if (clave !== clave2) {
      mensaje.textContent = "Las contraseñas no coinciden";
      mensaje.style.color = "#c0392b";
      return;
    }

    try {
      const res = await fetch(`${API}api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          correo,
          clave,
          rol: "usuario"          // Siempre se crea como usuario (cliente)
        })
      });

      const data = await res.json();

      if (res.ok) {
        mensaje.style.color = "#27ae60";
        mensaje.textContent = "¡Cuenta creada! Redirigiendo al login...";
        
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } else {
        mensaje.style.color = "#c0392b";
        mensaje.textContent = data.error || "Error al registrarse";
      }
    } catch (error) {
      mensaje.style.color = "#c0392b";
      mensaje.textContent = "Error de conexión. ¿Está corriendo la API?";
    }
  });
});