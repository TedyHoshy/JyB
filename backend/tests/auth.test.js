/**
 * Tests de Autenticación (Login) - API J & B
 */

const request = require("supertest");

jest.mock("../src/config/prisma", () => ({
  usuario: {
    findUnique: jest.fn(),
  },
}));

const prisma = require("../src/config/prisma");
const app = require("../src/app");

describe("API Auth - Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/login", () => {
    it("debe iniciar sesión con credenciales correctas", async () => {
      prisma.usuario.findUnique.mockResolvedValue({
        id: 1,
        nombre: "Admin",
        correo: "admin@jyb.com",
        clave: "123456",
        rol: "admin",
      });

      const res = await request(app).post("/api/login").send({
        correo: "admin@jyb.com",
        clave: "123456",
      });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        nombre: "Admin",
        correo: "admin@jyb.com",
        rol: "admin",
      });
      expect(res.body).not.toHaveProperty("clave");
    });

    it("debe devolver 401 con contraseña incorrecta", async () => {
      prisma.usuario.findUnique.mockResolvedValue({
        id: 1,
        nombre: "Admin",
        correo: "admin@jyb.com",
        clave: "123456",
        rol: "admin",
      });

      const res = await request(app).post("/api/login").send({
        correo: "admin@jyb.com",
        clave: "mala",
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/incorrectos/i);
    });

    it("debe devolver 401 si el correo no existe", async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);

      const res = await request(app).post("/api/login").send({
        correo: "noexiste@jyb.com",
        clave: "123456",
      });

      expect(res.status).toBe(401);
    });

    it("debe devolver 400 si faltan datos", async () => {
      const res = await request(app).post("/api/login").send({
        correo: "admin@jyb.com",
      });

      expect(res.status).toBe(400);
    });
  });
});
