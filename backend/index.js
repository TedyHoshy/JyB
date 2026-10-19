const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

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

// ========== USUARIOS ==========

// GET todos los usuarios
app.get("/api/usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { id: "asc" },
      select: { id: true, nombre: true, correo: true, rol: true, createdAt: true } // no enviamos la clave
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// POST crear usuario (trabajador o usuario)
app.post("/api/usuarios", async (req, res) => {
  try {
    const { nombre, correo, clave, rol } = req.body;

    const nuevo = await prisma.usuario.create({
      data: {
        nombre,
        correo: correo.toLowerCase(),
        clave,
        rol: rol || "trabajador"
      }
    });

    res.status(201).json({
      id: nuevo.id,
      nombre: nuevo.nombre,
      correo: nuevo.correo,
      rol: nuevo.rol
    });
  } catch (error) {
    console.error(error);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Ese correo ya está registrado" });
    }
    res.status(500).json({ error: "Error al crear el usuario" });
  }
});

// DELETE eliminar usuario
app.delete("/api/usuarios/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.usuario.delete({ where: { id } });
    res.json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
});

// POST login
app.post("/api/login", async (req, res) => {
  try {
    const { correo, clave } = req.body;

    const usuario = await prisma.usuario.findUnique({
      where: { correo: correo.toLowerCase() }
    });

    if (!usuario || usuario.clave !== clave) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el login" });
  }
});


// ========== VENTAS ==========

// POST crear una venta
app.post("/api/ventas", async (req, res) => {
  try {
    const { total, usuarioId, items } = req.body;

    const venta = await prisma.venta.create({
      data: {
        total: parseInt(total),
        usuarioId: usuarioId || null,
        items: {
          create: items.map(item => ({
            productoId: item.productoId,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad,
            subtotal: item.subtotal
          }))
        }
      },
      include: { items: true }
    });

    for (const item of items) {
      const producto = await prisma.producto.findUnique({
        where: { id: item.productoId }
      });
      if (producto) {
        const nuevoStock = producto.stock - item.cantidad;
        await prisma.producto.update({
          where: { id: item.productoId },
          data: { stock: Math.max(0, nuevoStock) }
        });
      }
    }

    res.status(201).json(venta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la venta" });
  }
});

// GET todas las ventas
app.get("/api/ventas", async (req, res) => {
  try {
    const ventas = await prisma.venta.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true }
    });
    res.json(ventas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener ventas" });
  }
});

// GET una venta por ID
app.get("/api/ventas/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const venta = await prisma.venta.findUnique({
      where: { id },
      include: { items: true }
    });
    if (!venta) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }
    res.json(venta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la venta" });
  }
});

// Iniciar servidor

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});