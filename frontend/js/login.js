// Usuarios de prueba (después se pueden pasar a Prisma)
const usuarios = [
  {
    correo: "admin@jb.com",
    clave: "admin123",
    nombre: "Administrador",
    rol: "admin"
  },
  {
    correo: "cajero@jb.com",
    clave: "cajero123",
    nombre: "Cajero",
    rol: "cajero"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const mensaje = document.getElementById("mensaje");

  // Si ya hay sesión, redirigir
  const sesion = JSON.parse(localStorage.getItem("sesion"));
  if (sesion) {
    redirigirSegunRol(sesion.rol);
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const clave = document.getElementById("clave").value;

    const usuario = usuarios.find(u => u.correo === correo && u.clave === clave);

    if (usuario) {
      // Guardar sesión
      localStorage.setItem("sesion", JSON.stringify({
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }));

      redirigirSegunRol(usuario.rol);
    } else {
      mensaje.textContent = "Correo o contraseña incorrectos";
      mensaje.style.color = "#c0392b";
    }
  });
});

function redirigirSegunRol(rol) {
  if (rol === "admin") {
    window.location.href = "admin/admin.html";
  } else {
    window.location.href = "minimercado/tienda.html";
  }
}