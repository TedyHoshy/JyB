// ============================================
// CONTROL DE SESIÓN
// ============================================

function obtenerSesion() {
  return JSON.parse(localStorage.getItem("sesion"));
}

function cerrarSesion() {
  localStorage.removeItem("sesion");
  window.location.href = "../index.html"; // desde admin o minimercado
}

function exigirLogin(rolesPermitidos = []) {
  const sesion = obtenerSesion();

  if (!sesion) {
    // No hay sesión → al login
    window.location.href = "../index.html";
    return null;
  }

  // Si se especifican roles y el usuario no tiene uno permitido
  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(sesion.rol)) {
    alert("No tienes permiso para entrar aquí");
    window.location.href = "../index.html";
    return null;
  }

  return sesion;
}