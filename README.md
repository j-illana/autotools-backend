# AutoTools Backend

API REST para la gestión interna de una distribuidora de autopartes. Maneja autenticación, inventario de productos y usuarios, con alertas de stock por email.

## Stack

- **Node.js** + **Express 5**
- **TypeScript 5** — con `tsx watch` en desarrollo
- **MySQL 8** — base de datos relacional
- **mysql2** — driver con soporte de promesas y pool de conexiones
- **jsonwebtoken** — autenticación con JWT
- **bcryptjs** — hash de contraseñas
- **nodemailer** — envío de alertas por email vía Gmail SMTP

## Requisitos previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- **MySQL 8** corriendo localmente

Verifica tus versiones con:

```bash
node -v
npm -v
mysql --version
```

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/j-illana/autotools-backend.git
cd autotools-backend

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de entorno
cp .env.example .env
```

Edita el `.env` con tus valores reales (ver sección de variables de entorno).

```bash
# 4. Crear la base de datos en MySQL
mysql -u root -p
```

```sql
CREATE DATABASE autotools;
EXIT;
```

```bash
# 5. Ejecutar los seeds para crear las tablas y cargar datos de prueba
npm run seed:users
npm run seed:products

# 6. Levantar el servidor de desarrollo
npm run dev
```

La API estará disponible en `http://localhost:3000`.

## Variables de entorno

Copia `.env.example` a `.env` y completa cada valor:

```env
# Servidor
PORT=3000

# Base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_de_mysql
DB_NAME=autotools

# JWT — genera un secret seguro con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=tu_secret_aqui
JWT_EXPIRES_IN=8h

# Email (Gmail SMTP)
EMAIL_USER=tu_cuenta@gmail.com
EMAIL_PASS=tu_app_password

# Frontend (para CORS)
FRONTEND_URL=http://localhost:5173
```

## Configurar alertas de email (Gmail App Password)

Las alertas de stock bajo se envían por email usando Gmail SMTP. Para que funcionen se necesita un **App Password** de Google — no es la contraseña normal de Gmail.

### Pasos

1. **Activar verificación en 2 pasos** en la cuenta de Google:
   - Entra a [myaccount.google.com](https://myaccount.google.com) → Security → 2-Step Verification
   - Sigue los pasos para activarla (requiere número de teléfono)

2. **Generar el App Password**:
   - Entra a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - En "App name" escribe `AutoTools`
   - Haz clic en **Create**
   - Google muestra un código de **16 caracteres** (ej: `abcd efgh ijkl mnop`)

3. **Pegarlo en el `.env`** sin espacios:
   ```env
   EMAIL_USER=tu_cuenta@gmail.com
   EMAIL_PASS=abcdefghijklmnop
   ```

4. **Reinicia el servidor** — nodemailer carga las credenciales al arrancar, no en caliente.

> **Importante:** El App Password solo se muestra una vez. Si se pierde, genera uno nuevo desde el mismo link y actualiza el `.env`.

### ¿Cuándo se envían las alertas?

Cada vez que un producto se actualiza con `stock <= min_stock`, el sistema envía un email a **todos los usuarios registrados** en la base de datos.

## Estructura del proyecto

```
src/
├── config/
│   └── db.ts                  # Pool de conexiones MySQL
├── controllers/
│   ├── auth.controller.ts     # Login
│   ├── product.controller.ts  # CRUD productos + alerta de stock
│   └── user.controller.ts     # CRUD usuarios
├── middlewares/
│   └── auth.middleware.ts     # authMiddleware + adminOnly
├── models/
│   ├── product.model.ts       # Queries de productos
│   └── user.model.ts          # Queries de usuarios
├── routes/
│   ├── auth.routes.ts
│   ├── product.routes.ts
│   └── user.routes.ts
├── scripts/
│   ├── seed-products.ts       # Crea tabla products y carga 20 productos
│   └── seed-users.ts          # Crea tabla users y carga usuarios de prueba
├── services/
│   └── email.service.ts       # Nodemailer — sendLowStockAlert
└── index.ts                   # Entry point, registro de rutas
```

## Endpoints

### Auth
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `POST` | `/api/auth/login` | Público | Devuelve JWT + datos del usuario |

### Productos
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `GET` | `/api/products` | Público | Lista todos los productos |
| `GET` | `/api/products/:id` | Público | Obtiene un producto por ID |
| `POST` | `/api/products` | Autenticado | Crea un producto |
| `PUT` | `/api/products/:id` | Autenticado | Actualiza un producto (dispara alerta si stock ≤ min_stock) |
| `DELETE` | `/api/products/:id` | Autenticado | Elimina un producto |

### Usuarios
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `GET` | `/api/users` | Admin | Lista todos los usuarios |
| `POST` | `/api/users` | Admin | Crea un usuario |
| `PUT` | `/api/users/:id` | Admin | Actualiza un usuario |
| `DELETE` | `/api/users/:id` | Admin | Elimina un usuario |

## Usuarios de prueba

Los seeds crean estos usuarios:

| Correo | Contraseña | Rol |
|--------|------------|-----|
| joseph.illana.j@gmail.com | admin123 | admin |
| joseph.illana@outlook.com | worker123 | worker |

## Comandos disponibles

```bash
npm run dev            # Servidor de desarrollo con tsx watch
npm run build          # Compilar TypeScript a dist/
npm run seed:users     # Crear tabla users y cargar usuarios de prueba
npm run seed:products  # Crear tabla products y cargar 20 productos
npx tsc --noEmit       # Verificar tipos sin compilar
```
