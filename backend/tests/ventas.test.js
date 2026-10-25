/**
 * Tests de Ventas - API J & B
 */

const request = require("supertest");

jest.mock("../src/config/prisma", () => ({
  venta: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  producto: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

const prisma = require("../src/config/prisma");
const app = require("../src/app");

describe("API Ventas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/ventas", () => {
    it("debe crear una venta y actualizar stock", async () => {
      const mockVenta = {
        id: 1,
        total: 19400,
        usuarioId: null,
        items: [
          {
            id: 1,
            productoId: 1,
            nombre: "El Chichero Chicha 1L",
            precio: 19400,
            cantidad: 1,
            subtotal: 19400,
          },
        ],
      };

      prisma.venta.create.mockResolvedValue(mockVenta);
      prisma.producto.findUnique.mockResolvedValue({
        id: 1,
        stock: 20,
      });
      prisma.producto.update.mockResolvedValue({ id: 1, stock: 19 });

      const res = await request(app)
        .post("/api/ventas")
        .send({
          total: 19400,
          items: [
            {
              productoId: 1,
              nombre: "El Chichero Chicha 1L",
              precio: 19400,
              cantidad: 1,
              subtotal: 19400,
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBe(1);
      expect(prisma.producto.update).toHaveBeenCalled();
    });

    it("debe devolver 400 si no hay items", async () => {
      const res = await request(app).post("/api/ventas").send({
        total: 0,
        items: [],
      });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/ventas", () => {
    it("debe devolver lista de ventas", async () => {
      prisma.venta.findMany.mockResolvedValue([
        { id: 1, total: 10000, items: [] },
      ]);

      const res = await request(app).get("/api/ventas");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/ventas/:id", () => {
    it("debe devolver una venta por id", async () => {
      prisma.venta.findUnique.mockResolvedValue({
        id: 1,
        total: 10000,
        items: [],
      });

      const res = await request(app).get("/api/ventas/1");

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
    });

    it("debe devolver 404 si no existe", async () => {
      prisma.venta.findUnique.mockResolvedValue(null);

      const res = await request(app).get("/api/ventas/999");

      expect(res.status).toBe(404);
    });
  });
});
