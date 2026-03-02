# Fixaro MVP

Fixaro es un marketplace local de servicios bajo demanda (estilo Uber-like) enfocado en rapidez y simplicidad.

## Stack
- **Frontend:** React + Vite (mobile-first)
- **Backend:** Node.js + Express
- **DB/Auth:** Supabase (email + password)

## Estructura

```txt
.
├── backend/
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── routes/
│       └── services/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── constants/
│       └── styles/
└── supabase/
    └── schema.sql
```

## Setup rápido

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea entorno backend:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Completa `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
3. Crea entorno frontend:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
4. En Supabase SQL editor, ejecuta `supabase/schema.sql`.
5. Ejecuta app completa:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:4000`

## API MVP

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Profile
- `GET /api/profile/me`
- `PUT /api/profile/me`
- `GET /api/profile/technicians?category=&location=`

### Admin
- `GET /api/admin/users`

### Meta
- `GET /api/meta/categories`

## Usuarios de ejemplo (crear manualmente)

- **Cliente**
  - email: `cliente@fixaro.app`
  - pass: `Fixaro123!`
  - role: `customer`
  - ciudad: `Monterrey`

- **Técnico**
  - email: `tecnico@fixaro.app`
  - pass: `Fixaro123!`
  - role: `technician`
  - categoría: `Electrician`
  - whatsapp: `5215551112233`

- **Admin**
  - email: `admin@fixaro.app`
  - pass: `Fixaro123!`
  - role: `admin`

## Notas MVP
- Sin pagos, reseñas, mapas ni chat interno.
- El contacto usa botón directo a WhatsApp con mensaje prellenado.
