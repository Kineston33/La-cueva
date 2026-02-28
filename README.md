# Fixaro MVP

Fixaro es un marketplace local de servicios con enfoque mobile-first para conectar clientes con técnicos cercanos de forma rápida.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- DB: Supabase (con modo demo en memoria para arrancar instantáneamente)
- Auth: Email + password (JWT)

## Estructura del proyecto

```
.
├── client/                 # React app
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── api/
│       └── styles/
├── server/                 # Express API
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── utils/
└── supabase/
    └── schema.sql          # Esquema + seed inicial
```

## Features MVP incluidas
1. Registro/Login con rol `customer` o `technician`.
2. Perfil de cliente y técnico (con edición desde frontend).
3. Categorías iniciales:
   - Electrician
   - Plumber
   - Appliance repair
   - Phone repair
   - Painter
   - General technician
4. Home de cliente con búsqueda/filtros por categoría y ciudad.
5. Ruta pública de perfil técnico `/technician/:nombre` (ej: `/technician/carlos-tecnico`).
6. Tarjetas de técnicos con botón de contacto WhatsApp.
7. Dashboard de técnico para editar perfil y disponibilidad.
8. Vista admin básica para listar usuarios y técnicos.
9. Rutas protegidas por autenticación/rol en frontend para dashboard y admin.

## Setup rápido

### 1) Instalar dependencias
```bash
npm install
```

### 2) Variables de entorno
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

`client/.env` usa `VITE_API_URL` (ejemplo: `http://localhost:4000/api`). Puede llevar o no slash final (`/`) porque el cliente lo normaliza automáticamente.

### 3) (Opcional) Conectar Supabase
- Crea un proyecto Supabase.
- Ejecuta `supabase/schema.sql` en SQL Editor.
- Copia `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` a `server/.env`.

> Si no configuras Supabase, Fixaro corre en modo demo con datos en memoria.

### 4) Ejecutar en desarrollo
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## API principal
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/market/categories`
- `GET /api/market/technicians?category=&city=`
- `GET /api/market/technicians/:nombre`
- `PUT /api/users/profile`
- `GET/PUT /api/users/technician/profile`
- `GET /api/admin/users` (admin)
- `GET /api/admin/technicians` (admin)

## Usuarios de prueba
Password para todos: `12345678`
- Cliente: `cliente@fixaro.com`
- Técnico: `tecnico@fixaro.com`
- Admin: `admin@fixaro.com`

## Contacto WhatsApp
El botón **Contactar por WhatsApp** abre:

`https://wa.me/<numero>?text=Hi,%20I%20found%20you%20on%20Fixaro%20and%20need%20a%20service.`

Sin chat interno, tal como MVP.
