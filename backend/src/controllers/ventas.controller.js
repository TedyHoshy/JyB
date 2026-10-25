const prisma = require("../config/prisma");

const ventasController = {
  // POST /api/ventas
  async create(req, res) {
    try {
      const { total, usuarioId, items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ error: "items es obligatorio y debe ser un array no vacío" });
      }

      const venta = await prisma.venta.create({
        data: {
          total: parseInt(total),
          usuarioId: usuarioId || null,
          items: {
            create: items.map((item) => ({
              productoId: item.productoId,
              nombre: item.nombre,
              precio: item.precio,
              cantidad: item.cantidad,
              subtotal: item.subtotal,
            })),
          },
        },
        include: { items: true },
      });

      // Actualizar stock
      for (const item of items) {
        const producto = await prisma.producto.findUnique({
          where: { id: item.productoId },
        });
        if (producto) {
          const nuevoStock = producto.stock - item.cantidad;
          await prisma.producto.update({
            where: { id: item.productoId },
            data: { stock: Math.max(0, nuevoStock) },
          });
        }
      }

      res.status(201).json(venta);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear la venta" });
    }
  },

  // GET /api/ventas
  async getAll(req, res) {
    try {
      const ventas = await prisma.venta.findMany({
        orderBy: { createdAt: "desc" },
        include: { items: true },
      });
      res.json(ventas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener ventas" });
    }
  },

  // GET /api/ventas/:id
  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const venta = await prisma.venta.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!venta) {
        return res.status(404).json({ error: "Venta no encontrada" });
      }

      res.json(venta);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener la venta" });
    }
  },
};

module.exports = ventasController;
