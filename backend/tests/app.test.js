/**
 * Tests generales de la aplicación
 */

const request = require("supertest");
const app = require("../src/app");

describe("App general", () => {
  it("GET / debe responder con mensaje de API funcionando", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("mensaje");
    expect(res.body.mensaje).toMatch(/J & B/i);
  });

  it("ruta inexistente debe devolver 404", async () => {
    const res = await request(app).get("/api/ruta-que-no-existe");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});
