const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ mensaje: "API de J & B funcionando" });
});

// ========== PRODUCTOS ==========

// GET todos los productos
app.get("/api/productos", async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { id: "asc" }
    });
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// GET un producto por ID
app.get("/api/productos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const producto = await prisma.producto.findUnique({ where: { id } });

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// POST crear producto
app.post("/api/productos", async (req, res) => {
  try {
    const { nombre, precio, stock, foto, categoria } = req.body;

    const nuevo = await prisma.producto.create({
      data: {
        nombre,
        precio: parseInt(precio),
        stock: parseInt(stock),
        foto: foto || "sin-foto.jpg",
        categoria: categoria || "Sin categoría"
      }
    });

    res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

// PUT actualizar producto
app.put("/api/productos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, precio, stock, foto, categoria } = req.body;

    const actualizado = await prisma.producto.update({
      where: { id },
      data: {
        nombre,
        precio: parseInt(precio),
        stock: parseInt(stock),
        foto,
        categoria
      }
    });

    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// DELETE eliminar producto
app.delete("/api/productos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.producto.delete({ where: { id } });

    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});