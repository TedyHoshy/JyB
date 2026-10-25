/**
 * app.js - Configuración de Express
 * Orden: middlewares globales → rutas → 404 → error handler
 */
const express = require("express");
const cors = require("cors");

const productosRoutes = require("./routes/productos.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const authRoutes = require("./routes/auth.routes");
const ventasRoutes = require("./routes/ventas.routes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

// ---- Middlewares globales ----
app.use(
  cors({
    origin: true, // temporal; luego restringir a tu dominio
  })
);
app.use(express.json());

// ---- Health / raíz ----
app.get("/", (req, res) => {
  res.json({ mensaje: "API de J & B funcionando", version: "2.0" });
});

// ---- Rutas API (ordenadas por dominio) ----
app.use("/api/productos", productosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api", authRoutes); // POST /api/login
app.use("/api/ventas", ventasRoutes);

// ---- 404 y errores ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
