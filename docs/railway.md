# Railway — Hosting del Backend

## ¿Qué es Railway?

Railway es una plataforma de despliegue que permite subir aplicaciones backend sin configurar servidores. Soporta Node.js, Python, Go, y más mediante **Nixpacks** (detección automática del entorno).

## Rol en MusicLearner

Railway hostea el backend Express en producción. Cada vez que se hace `git push` a la rama conectada, Railway reconstruye y redeploya automáticamente.

## Configuración

Archivo `railway.json` en la raíz del backend:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node src/index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

- **Builder:** Nixpacks detecta `package.json` y corre `npm install` automáticamente.
- **Start command:** `node src/index.js`.
- **Restart:** Si el proceso falla, lo reintenta hasta 3 veces.

## Variables de Entorno en Railway

Se configuran desde el dashboard de Railway:

| Variable | Valor |
|----------|-------|
| `PORT` | 3001 |
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_KEY` | Anon key de Supabase |
| `FRONTEND_URL` | URL del frontend en producción |

## Flujo de Despliegue

1. Se hace push a GitHub.
2. Railway detecta el cambio, clona el repo, instala dependencias y ejecuta `node src/index.js`.
3. El backend queda disponible en `https://musicleaner-backend.up.railway.app` (o la URL asignada).

## Diferencia con el entorno local

| Aspecto | Local | Railway |
|---------|-------|---------|
| URL | `http://localhost:3001` | `https://musicleaner-backend.up.railway.app` |
| Variables de entorno | Archivo `.env` | Dashboard de Railway |
| Puerto fijo | Sí (3001) | Railway asigna el puerto via `PORT` |
