const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Borrar productos anteriores (por si se ejecuta varias veces)
  await prisma.producto.deleteMany();

  // Crear los 8 productos
  await prisma.producto.createMany({
    data: [
      {
        nombre: "Arroz 1kg",
        precio: 4500,
        stock: 20,
        foto: "arroz.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Aceite 1L",
        precio: 8900,
        stock: 15,
        foto: "aceite.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Leche 1L",
        precio: 4200,
        stock: 25,
        foto: "leche.jpg",
        categoria: "Lácteos"
      },
      {
        nombre: "Huevos x12",
        precio: 7800,
        stock: 18,
        foto: "huevos.jpg",
        categoria: "Lácteos"
      },
      {
        nombre: "Pan tajado",
        precio: 3500,
        stock: 12,
        foto: "pan.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Azúcar 1kg",
        precio: 3800,
        stock: 22,
        foto: "azucar.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Café 500g",
        precio: 12500,
        stock: 10,
        foto: "cafe.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Jabón líquido",
        precio: 9500,
        stock: 14,
        foto: "jabon.jpg",
        categoria: "Aseo"
      }
    ]
  });

  console.log("✅ Productos cargados correctamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });