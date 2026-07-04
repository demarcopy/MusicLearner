# Supabase — Base de Datos y Backend como Servicio

## ¿Qué es Supabase?

Supabase es un **BaaS** (Backend as a Service) de código abierto. Ofrece base de datos PostgreSQL, autenticación, almacenamiento de archivos y API REST automática. En MusicLearner lo usamos **solo como base de datos**.

## Rol en MusicLearner

Supabase reemplaza el `localStorage` del frontend como capa de persistencia **cuando el backend Express está corriendo**. Almacena dos cosas:

### Tabla `songs`
Canciones/tablaturas guardadas por el usuario.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID (PK) | Autogenerado |
| `title` | TEXT | Título de la canción |
| `artist` | TEXT | Artista o banda |
| `content` | TEXT | Contenido de la tablatura |
| `songsterr_id` | INTEGER | ID en Songsterr (nullable) |
| `created_at` | TIMESTAMPTZ | Fecha de creación |

### Tabla `routines`
Rutinas de práctica creadas por el usuario.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID (PK) | Autogenerado |
| `name` | TEXT | Nombre de la rutina |
| `exercises` | JSONB | Array de ejercicios (nombre + duración) |
| `type` | TEXT | Tipo de rutina (default `'custom'`) |
| `created_at` | TIMESTAMPTZ | Fecha de creación |

## Conexión desde el backend

El archivo `src/db.js` inicializa el cliente de Supabase usando dos variables de entorno:

```
SUPABASE_URL=https://tqbguvqoxjgnnsgpgwat.supabase.co
SUPABASE_KEY=sb_secret_...
```

Si alguna de las dos falta, el servidor **se niega a iniciar**.

## Migraciones

El archivo `src/migrations/001_create_tables.sql` contiene las sentencias SQL para crear ambas tablas. Se ejecutaron manualmente desde el **SQL Editor** de Supabase.

## Seguridad

- Se usa la **anon key** (no la `service_role`), lo que significa que las queries van con `RLS` (Row Level Security) si está activado.
- Actualmente **no hay autenticación** de usuarios, consistente con la filosofía serverless del proyecto.
