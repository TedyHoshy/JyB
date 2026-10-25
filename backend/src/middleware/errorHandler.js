/**
 * Middleware de manejo de errores centralizado
 */
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Error interno del servidor",
  });
}

/**
 * Middleware 404
 */
function notFound(req, res) {
  res.status(404).json({ error: "Ruta no encontrada" });
}

module.exports = { errorHandler, notFound };
