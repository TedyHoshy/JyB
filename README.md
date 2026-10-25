# J & B Carnicería y Mini Mercado

Proyecto web completo (frontend + backend) para la tienda J & B.

## Estructura del proyecto

```
jyb_organizado/
├── backend/
│   ├── index.js                 # Solo arranca el servidor (puerto)
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   ├── src/
│   │   ├── app.js               # Express + middlewares + montaje de rutas
│   │   ├── config/
│   │   │   └── prisma.js        # Cliente Prisma
│   │   ├── middleware/
│   │   │   └── errorHandler.js  # 404 y errores
│   │   ├── controllers/         # Lógica de negocio (por dominio)
│   │   │   ├── auth.controller.js
│   │   │   ├── productos.controller.js
│   │   │   ├── usuarios.controller.js
│   │   │   └── ventas.controller.js
│   │   └── routes/              # Definición de rutas (por dominio)
│   │       ├── auth.routes.js
│   │       ├── productos.routes.js
│   │       ├── usuarios.routes.js
│   │       └── ventas.routes.js
│   └── tests/                   # Jest + Supertest
│       ├── app.test.js
│       ├── auth.test.js
│       ├── productos.test.js
│       ├── usuarios.test.js
│       └── ventas.test.js
└── frontend/
    ├── index.html               # Login
    ├── registro.html
    ├── admin/                   # Panel administrador
    │   ├── admin.html           # Inventario
    │   ├── tienda.html          # Probar tienda
    │   ├── caja.html            # Caja propia del admin ★
    │   ├── usuarios.html
    │   └── js/
    │       ├── admin.js
    │       ├── tienda.js
    │       ├── caja.js          # Caja admin ★
    │       └── usuarios.js
    ├── carniceria/
    ├── minimercado/
    ├── css/
    ├── js/
    └── img/
```

## Backend organizado

El código **ya no está en un solo `index.js`**.

| Archivo | Responsabilidad |
|---------|-----------------|
| `index.js` | Arranca el servidor (`listen`) |
| `src/app.js` | Crea Express, middlewares, monta rutas |
| `src/config/prisma.js` | Cliente de base de datos |
| `src/controllers/*.js` | Lógica de cada dominio |
| `src/routes/*.js` | Define GET/POST/PUT/DELETE |
| `src/middleware/errorHandler.js` | 404 y errores globales |
| `tests/*.test.js` | Pruebas automatizadas |

### Instalación y scripts

```bash
cd backend
npm install
npm run dev          # desarrollo
npm start            # producción
npm test             # tests
npm run test:coverage
```

Configura `DATABASE_URL` en `backend/.env`.

### Endpoints

- `GET/POST/PUT/DELETE /api/productos`
- `GET/POST/DELETE /api/usuarios`
- `POST /api/login`
- `GET/POST /api/ventas` y `GET /api/ventas/:id`

## Frontend – Caja del Admin

El administrador tiene **su propia caja** en:

- `frontend/admin/caja.html`
- `frontend/admin/js/caja.js`

Desde Inventario, Usuarios y Probar Tienda hay enlace **Caja**.  
Muestra ventas del día (o de otra fecha), total del día y detalle de cada ticket.

## Versión

2.1 – Backend modular + caja propia del admin.
