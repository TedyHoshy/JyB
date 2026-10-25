/**
 * Tests de Productos - API J & B
 * Usamos mocks de Prisma para no depender de la base de datos real.
 */

const request = require("supertest");

// Mock de Prisma antes de importar la app
jest.mock("../src/config/prisma", () => ({
  producto: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const prisma = require("../src/config/prisma");
const app = require("../src/app");

describe("API Productos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/productos", () => {
    it("debe devolver lista de productos", async () => {
      const mockProductos = [
        {
          id: 1,
          nombre: "El Chichero Chicha 1L",
          precio: 19400,
          stock: 20,
          foto: "foto.jpg",
          categoria: "Bebidas",
        },
      ];
      prisma.producto.findMany.mockResolvedValue(mockProductos);

      const res = await request(app).get("/api/productos");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProductos);
      expect(prisma.producto.findMany).toHaveBeenCalledTimes(1);
    });

    it("debe devolver 500 si hay error de DB", async () => {
      prisma.producto.findMany.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/api/productos");

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /api/productos/:id", () => {
    it("debe devolver un producto por id", async () => {
      const mockProducto = {
        id: 1,
        nombre: "Producto Test",
        precio: 1000,
        stock: 5,
        foto: "test.jpg",
        categoria: "Test",
      };
      prisma.producto.findUnique.mockResolvedValue(mockProducto);

      const res = await request(app).get("/api/productos/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProducto);
    });

    it("debe devolver 404 si el producto no existe", async () => {
      prisma.producto.findUnique.mockResolvedValue(null);

      const res = await request(app).get("/api/productos/999");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Producto no encontrado");
    });
  });

  describe("POST /api/productos", () => {
    it("debe crear un producto correctamente", async () => {
      const nuevo = {
        id: 10,
        nombre: "Nuevo Producto",
        precio: 5000,
        stock: 15,
        foto: "nuevo.jpg",
        categoria: "Abarrotes",
      };
      prisma.producto.create.mockResolvedValue(nuevo);

      const res = await request(app).post("/api/productos").send({
        nombre: "Nuevo Producto",
        precio: 5000,
        stock: 15,
        foto: "nuevo.jpg",
        categoria: "Abarrotes",
      });

      expect(res.status).toBe(201);
      expect(res.body.nombre).toBe("Nuevo Producto");
      expect(prisma.producto.create).toHaveBeenCalled();
    });

    it("debe devolver 400 si faltan campos obligatorios", async () => {
      const res = await request(app).post("/api/productos").send({
        nombre: "Sin precio",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/obligatorios/i);
    });
  });

  describe("PUT /api/productos/:id", () => {
    it("debe actualizar un producto", async () => {
      const actualizado = {
        id: 1,
        nombre: "Actualizado",
        precio: 2000,
        stock: 8,
        foto: "a.jpg",
        categoria: "Test",
      };
      prisma.producto.update.mockResolvedValue(actualizado);

      const res = await request(app).put("/api/productos/1").send({
        nombre: "Actualizado",
        precio: 2000,
        stock: 8,
        foto: "a.jpg",
        categoria: "Test",
      });

      expect(res.status).toBe(200);
      expect(res.body.nombre).toBe("Actualizado");
    });
  });

  describe("DELETE /api/productos/:id", () => {
    it("debe eliminar un producto", async () => {
      prisma.producto.delete.mockResolvedValue({});

      const res = await request(app).delete("/api/productos/1");

      expect(res.status).toBe(200);
      expect(res.body.mensaje).toBe("Producto eliminado");
    });
  });
});
