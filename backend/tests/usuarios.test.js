/**
 * Tests de Usuarios - API J & B
 */

const request = require("supertest");

jest.mock("../src/config/prisma", () => ({
  usuario: {
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
}));

const prisma = require("../src/config/prisma");
const app = require("../src/app");

describe("API Usuarios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/usuarios", () => {
    it("debe devolver lista de usuarios sin la clave", async () => {
      const mockUsuarios = [
        {
          id: 1,
          nombre: "Admin",
          correo: "admin@jyb.com",
          rol: "admin",
          createdAt: new Date().toISOString(),
        },
      ];
      prisma.usuario.findMany.mockResolvedValue(mockUsuarios);

      const res = await request(app).get("/api/usuarios");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUsuarios);
      expect(prisma.usuario.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.objectContaining({
            id: true,
            nombre: true,
            correo: true,
            rol: true,
            createdAt: true,
          }),
        })
      );
    });
  });

  describe("POST /api/usuarios", () => {
    it("debe crear un usuario", async () => {
      prisma.usuario.create.mockResolvedValue({
        id: 2,
        nombre: "Trabajador",
        correo: "trab@jyb.com",
        clave: "pass",
        rol: "trabajador",
      });

      const res = await request(app).post("/api/usuarios").send({
        nombre: "Trabajador",
        correo: "trab@jyb.com",
        clave: "pass",
        rol: "trabajador",
      });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: 2,
        nombre: "Trabajador",
        correo: "trab@jyb.com",
        rol: "trabajador",
      });
      expect(res.body).not.toHaveProperty("clave");
    });

    it("debe devolver 400 si el correo ya existe", async () => {
      const error = new Error("Unique constraint");
      error.code = "P2002";
      prisma.usuario.create.mockRejectedValue(error);

      const res = await request(app).post("/api/usuarios").send({
        nombre: "Dup",
        correo: "admin@jyb.com",
        clave: "123",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/ya está registrado/i);
    });

    it("debe devolver 400 si faltan campos", async () => {
      const res = await request(app).post("/api/usuarios").send({
        nombre: "Solo nombre",
      });

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/usuarios/:id", () => {
    it("debe eliminar un usuario", async () => {
      prisma.usuario.delete.mockResolvedValue({});

      const res = await request(app).delete("/api/usuarios/1");

      expect(res.status).toBe(200);
      expect(res.body.mensaje).toBe("Usuario eliminado");
    });
  });
});
