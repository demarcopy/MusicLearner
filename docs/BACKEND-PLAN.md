# Plan de Backend: Node.js/Express + Supabase

## Visión General

Migrar MusicLearner de una SPA 100% frontend a una **arquitectura híbrida** donde el backend maneje persistencia, proxy CORS y lógica de negocio, mientras el frontend mantiene capacidad offline mediante `localStorage` como fallback.

## Arquitectura

```
┌──────────────────────────────────────────────────────────┐
│                      Navegador                            │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Frontend (React SPA)                               │ │
│  │  ├── Online → llama a api.musiclearner.com          │ │
│  │  └── Offline → usa localStorage                     │ │
│  └─────────────────────────────────────────────────────┘ │
│                           ↓                               │
│                    HTTPS / CORS                           │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│              Railway (Node.js/Express)                    │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  src/index.js          → Entry point + Express app  │ │
│  │  src/db.js             → Conexión Supabase          │ │
│  │  src/routes/                                        │ │
│  │  ├── songs.js          → CRUD de canciones          │ │
│  │  ├── routines.js       → CRUD de rutinas            │ │
│  │  └── songsterr.js      → Proxy a Songsterr API      │ │
│  │  src/middleware/                                     │ │
│  │  └── errorHandler.js   → Manejo centralizado errores│ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│              Supabase (PostgreSQL)                        │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  songs       → id, title, artist, content,          │ │
│  │                  songsterr_id, created_at            │ │
│  │  routines    → id, name, exercises (JSONB),         │ │
│  │                  type, created_at                    │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

## Stack del Backend

| Componente | Tecnología |
|-----------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express 4 |
| Base de datos | PostgreSQL (Supabase) |
| ORM/Query | `@supabase/supabase-js` (cliente nativo) |
| Validación | express-validator |
| CORS | cors middleware |
| Variables de entorno | dotenv |
| Despliegue | Railway |

## API Endpoints

### Canciones (`/api/songs`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/songs` | Listar todas las canciones |
| GET | `/api/songs/:id` | Obtener una canción |
| POST | `/api/songs` | Crear canción `{ title, artist, content?, songsterrId? }` |
| PUT | `/api/songs/:id` | Actualizar canción |
| DELETE | `/api/songs/:id` | Eliminar canción |

### Rutinas (`/api/routines`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/routines` | Listar todas las rutinas |
| GET | `/api/routines/:id` | Obtener una rutina |
| POST | `/api/routines` | Crear rutina `{ name, exercises: [{ name, durationMinutes }] }` |
| PUT | `/api/routines/:id` | Actualizar rutina |
| DELETE | `/api/routines/:id` | Eliminar rutina |

### Proxy Songsterr (`/api/songsterr`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/songsterr?q=pattern` | Busca canciones en Songsterr y devuelve JSON |

Este endpoint reemplaza el uso actual de `api.allorigins.win`. El backend hace la petición a Songsterr desde el servidor (sin restricciones CORS) y retorna los datos al frontend.

## Base de Datos (Supabase)

```sql
CREATE TABLE songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  content TEXT DEFAULT '',
  songsterr_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE routines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  exercises JSONB NOT NULL,
  type TEXT DEFAULT 'custom',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_songs_artist ON songs(artist);
CREATE INDEX idx_songs_title ON songs(title);
```

## Variables de Entorno

```env
# backend/.env
PORT=3001
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-supabase-anon-key
FRONTEND_URL=https://tu-frontend.vercel.app
```

## Migración desde localStorage (Frontend)

Estrategia **Online-first con fallback offline**:

1. Si hay conexión al backend (`GET /api/health` responde), opera contra la API.
2. Si no hay conexión, usa `localStorage` como hasta ahora.
3. Botón "Sincronizar con la nube" que sube datos locales al backend.
4. Almacenar en `localStorage` un flag `lastSyncAt` para saber cuándo fue la última sincronización.

### Adaptador propuesto

```js
// frontend/src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function api(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    })
    if (!res.ok) throw new Error('API error')
    return await res.json()
  } catch {
    return null // Fallback a localStorage
  }
}
```

## Estructura Final de Carpetas

```
MusicLearner/
├── frontend/                     # Sin cambios mayores
│   ├── src/
│   │   ├── services/             # NUEVO: servicios API
│   │   │   ├── api.js            # Cliente HTTP con fallback
│   │   │   ├── songsService.js   # CRUD canciones
│   │   │   └── routinesService.js # CRUD rutinas
│   │   └── pages/
│   │       ├── Library.jsx       # MODIFICADO: consume API
│   │       └── Routines.jsx      # MODIFICADO: consume API
│   └── .env                      # VITE_API_URL
├── backend/                      # NUEVO
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   ├── routes/
│   │   │   ├── songs.js
│   │   │   ├── routines.js
│   │   │   └── songsterr.js
│   │   └── middleware/
│   │       └── errorHandler.js
│   ├── .env.example
│   ├── package.json
│   └── railway.json
├── docs/
│   ├── ARCHITECTURE.md
│   └── BACKEND-PLAN.md           # Este documento
└── AGENTS.md
```

## Despliegue

### Railway

1. Crear cuenta en [Railway.app](https://railway.app/)
2. Conectar repositorio de GitHub
3. Railway detecta automáticamente el `package.json` en `backend/`
4. Configurar variables de entorno en Railway Dashboard
5. `railway.json` indica el comando de inicio

### Supabase

1. Crear proyecto en [Supabase.com](https://supabase.com/) (gratis)
2. Copiar `Project URL` y `anon public key`
3. Ejecutar el SQL de creación de tablas en SQL Editor
4. Configurar CORS en Supabase para aceptar peticiones del frontend

## Costos

| Servicio | Free Tier | Uso estimado/mes |
|----------|-----------|-----------------|
| Railway | $5 crédito inicial | ~$0.50-1.00 |
| Supabase | 500MB DB, 2GB RAM | $0 |
| Vercel (frontend) | 100GB ancho de banda | $0 |
| **Total** | | **~$0.50-1.00** |

## Roadmap

1. **Fase 1:** Crear backend con endpoints básicos y proxy Songsterr
2. **Fase 2:** Desplegar backend en Railway y frontend actualizado en Vercel
3. **Fase 3:** Agregar autenticación (opcional, Supabase Auth)
4. **Fase 4:** Migrar datos de usuarios existentes
5. **Fase 5:** Agregar tests (Vitest backend + React Testing Library frontend)
