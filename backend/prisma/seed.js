const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // ========== PRODUCTOS ==========
  await prisma.producto.deleteMany();

  await prisma.producto.createMany({
    data: [
      // Bebidas - El Chichero
      {
        nombre: "El Chichero Chicha 1L",
        precio: 19400,
        stock: 20,
        foto: "El Chichero Chicha 1L.jpg",
        categoria: "Bebidas"
      },
      {
        nombre: "El Chichero Chicha 500ml",
        precio: 13200,
        stock: 20,
        foto: "El Chichero Chicha 500ml.jpg",
        categoria: "Bebidas"
      },
      {
        nombre: "El Chichero Chicha 330ml",
        precio: 8500,
        stock: 20,
        foto: "El Chichero Chicha 11.16 fl oz = ~330 ml.jpg",
        categoria: "Bebidas"
      },

      // Lácteos
      {
        nombre: "Rikesa Queso Cheddar 200g",
        precio: 19300,
        stock: 10,
        foto: "Rikesa Queso fundido Cheddar 200g.jpg",
        categoria: "Lácteos"
      },

      // Abarrotes
      {
        nombre: "Nestlé Cerelac 400g",
        precio: 35000,
        stock: 10,
        foto: "Nestlé Cerelac 400g.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Robin Hood Harina 900g",
        precio: 9800,
        stock: 15,
        foto: "Robin Hood Harina de trigo 900g.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Mavesa Margarina 1kg",
        precio: 27500,
        stock: 10,
        foto: "Mavesa Margarina 1kg.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Mavesa Margarina 500g",
        precio: 15500,
        stock: 12,
        foto: "Mavesa Margarina 500g.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Mavesa Margarina 250g",
        precio: 9600,
        stock: 15,
        foto: "Mavesa Margarina 250g.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Mavesa Mayonesa 910g",
        precio: 39000,
        stock: 10,
        foto: "Mavesa Mayonesa 910g.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Mavesa Mayonesa 445g",
        precio: 20000,
        stock: 12,
        foto: "Mavesa Mayonesa 445g.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Mavesa Mayonesa 175g",
        precio: 11600,
        stock: 15,
        foto: "Mavesa Mayonesa 175g.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Underwood Diablitos 115g",
        precio: 13700,
        stock: 12,
        foto: "Underwood Diablitos 115g.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Underwood Diablitos 54g",
        precio: 8000,
        stock: 15,
        foto: "Underwood Diablitos 54g.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Nestlé Samba Fresa 32g",
        precio: 5200,
        stock: 30,
        foto: "Nestlé Samba Fresa 32g.jpg",
        categoria: "Abarrotes"
      },
      {
        nombre: "Nestlé Samba Chocolate 32g",
        precio: 5200,
        stock: 30,
        foto: "Nestlé Samba Chocolate 32g.jpg",
        categoria: "Abarrotes"
      }
    ]
  });

  // ========== USUARIOS ==========
  await prisma.usuario.deleteMany();

  await prisma.usuario.createMany({
    data: [
      {
        nombre: "Administrador",
        correo: "admin@jb.com",
        clave: "admin123",
        rol: "admin"
      },
      {
        nombre: "Carlos Cajero",
        correo: "trabajador@jb.com",
        clave: "trab123",
        rol: "trabajador"
      },
      {
        nombre: "Cliente Demo",
        correo: "usuario@jb.com",
        clave: "user123",
        rol: "usuario"
      }
    ]
  });

  console.log("✅ Productos y usuarios cargados correctamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });