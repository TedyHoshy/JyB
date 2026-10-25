const prisma = require("../config/prisma");

const usuariosController = {
  // GET /api/usuarios
  async getAll(req, res) {
    try {
      const usuarios = await prisma.usuario.findMany({
        orderBy: { id: "asc" },
        select: {
          id: true,
          nombre: true,
          correo: true,
          rol: true,
          createdAt: true,
        },
      });
      res.json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  },

  // POST /api/usuarios
  async create(req, res) {
    try {
      const { nombre, correo, clave, rol } = req.body;

      if (!nombre || !correo || !clave) {
        return res
          .status(400)
          .json({ error: "nombre, correo y clave son obligatorios" });
      }

      const nuevo = await prisma.usuario.create({
        data: {
          nombre,
          correo: correo.toLowerCase(),
          clave,
          rol: rol || "trabajador",
        },
      });

      res.status(201).json({
        id: nuevo.id,
        nombre: nuevo.nombre,
        correo: nuevo.correo,
        rol: nuevo.rol,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "P2002") {
        return res.status(400).json({ error: "Ese correo ya está registrado" });
      }
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  },

  // DELETE /api/usuarios/:id
  async remove(req, res) {
    try {
      const id = parseInt(req.params.id);
      await prisma.usuario.delete({ where: { id } });
      res.json({ mensaje: "Usuario eliminado" });
    } catch (error) {
      console.error(error);
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.status(500).json({ error: "Error al eliminar el usuario" });
    }
  },
};

module.exports = usuariosController;
