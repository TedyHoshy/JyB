const prisma = require("../config/prisma");

const authController = {
  // POST /api/login
  async login(req, res) {
    try {
      const { correo, clave } = req.body;

      if (!correo || !clave) {
        return res
          .status(400)
          .json({ error: "correo y clave son obligatorios" });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { correo: correo.toLowerCase() },
      });

      if (!usuario || usuario.clave !== clave) {
        return res
          .status(401)
          .json({ error: "Correo o contraseña incorrectos" });
      }

      res.json({
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error en el login" });
    }
  },
};

module.exports = authController;
