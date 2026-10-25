const prisma = require("../config/prisma");

const productosController = {
  // GET /api/productos
  async getAll(req, res) {
    try {
      const productos = await prisma.producto.findMany({
        orderBy: { id: "asc" },
      });
      res.json(productos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener productos" });
    }
  },

  // GET /api/productos/:id
  async getById(req, res) {
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
  },

  // POST /api/productos
  async create(req, res) {
    try {
      const { nombre, precio, stock, foto, categoria } = req.body;

      if (!nombre || precio == null || stock == null) {
        return res
          .status(400)
          .json({ error: "nombre, precio y stock son obligatorios" });
      }

      const nuevo = await prisma.producto.create({
        data: {
          nombre,
          precio: parseInt(precio),
          stock: parseInt(stock),
          foto: foto || "sin-foto.jpg",
          categoria: categoria || "Sin categoría",
        },
      });

      res.status(201).json(nuevo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el producto" });
    }
  },

  // PUT /api/productos/:id
  async update(req, res) {
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
          categoria,
        },
      });

      res.json(actualizado);
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.status(500).json({ error: "Error al actualizar el producto" });
    }
  },

  // DELETE /api/productos/:id
  async remove(req, res) {
    try {
      const id = parseInt(req.params.id);
      await prisma.producto.delete({ where: { id } });
      res.json({ mensaje: "Producto eliminado" });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
  },
};

module.exports = productosController;
