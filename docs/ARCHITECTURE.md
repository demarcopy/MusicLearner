# Arquitectura del Sistema: MusicLearner

## Visión General

MusicLearner es una **Single Page Application (SPA)** 100% frontend para guitarristas. Funciona sin servidor backend — toda la lógica, persistencia y cómputo musical ocurre en el navegador del usuario.

**Propósito:** Proporcionar una academia de música interactiva con biblioteca de tablaturas, lecciones de teoría, un gimnasio de práctica con metrónomo, y un constructor de rutinas cronometradas.

**Idioma:** Español (UI, lecciones, documentación).

---

## Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| UI | React 19 | Componentes funcionales con hooks |
| Enrutamiento | React Router DOM v7 | Navegación SPA client-side |
| Build | Vite 8 | Dev server y bundler de producción |
| Teoría Musical | @tonaljs/tonal v4 | Cómputo de escalas, acordes e intervalos |
| Persistencia | Web Storage API (`localStorage`) | Almacenamiento local de canciones y rutinas |
| Sonido | Web Audio API | Generación de clics de metrónomo |
| Gráficos | SVG paramétrico inline | Renderizado del diapasón de guitarra |
| Estilos | CSS Vanilla con custom properties | Tema oscuro con acento verde |
| Proxy CORS | allorigins.win | Puente público para evitar CORS en búsquedas a Songsterr |
| Despliegue | Vercel / Netlify | Hosting estático con rewrites SPA |

---

## Estructura del Proyecto

```
MusicLearner/
├── README.md                          # Documentación principal del proyecto
├── docs/
│   └── ARCHITECTURE.md                # Este documento
├── frontend/
│   ├── index.html                     # Entry point HTML (SPA shell)
│   ├── package.json                   # Dependencias y scripts
│   ├── vite.config.js                 # Configuración de Vite
│   ├── eslint.config.js               # ESLint flat config
│   ├── vercel.json                    # Reglas de rewrite para SPA
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── main.jsx                   # Punto de entrada React
│       ├── App.jsx                    # Componente raíz + Router
│       ├── App.css                    # Estilos globales de la aplicación (476 líneas)
│       ├── index.css                  # Estilos base/reset (Vite template)
│       ├── components/
│       │   ├── Navbar.jsx             # Barra de navegación superior
│       │   ├── ChordDiagram.jsx       # Motor de renderizado SVG del diapasón
│       │   └── ChordDiagram.css       # Estilos del diagrama de acordes
│       └── pages/
│           ├── Library.jsx            # Página: Biblioteca de tablaturas
│           ├── Theory.jsx             # Página: Lecciones de teoría musical
│           ├── Practice.jsx           # Página: Gimnasio multidisciplinario
│           └── Routines.jsx           # Página: Constructor de rutinas
```

---

## Árbol de Componentes y Enrutamiento

```
<BrowserRouter>                          (App.jsx)
├── <Navbar />                           (Navbar.jsx)
└── <Routes>
    ├── path="/"       → <Library />     (Library.jsx)
    ├── path="/teoria" → <Theory />      (Theory.jsx)
    ├── path="/practica" → <Practice />  (Practice.jsx)
    │                      └── <ChordDiagram />  (ChordDiagram.jsx)
    └── path="/rutinas" → <Routines />   (Routines.jsx)
```

Cada ruta se mapea a una página independiente sin estado compartido entre ellas (no hay contexto global ni estado de aplicación compartido más que `localStorage`).

---

## Arquitectura por Páginas

### 1. Library (`/`) — Biblioteca de Tablaturas

**Propósito:** Buscar canciones en Songsterr y mantener una biblioteca local.

**Flujo de datos:**
1. Al montar: carga `misCanciones` desde `localStorage`.
2. El usuario escribe una consulta y envía el formulario.
3. Se construye una URL: `https://api.allorigins.win/raw?url=<songsterr_api_url>`.
4. `fetch()` obtiene los resultados JSON (top 10).
5. El usuario puede guardar canciones en `localStorage` o eliminarlas.

**Estados locales:** `songs`, `loading`, `searchQuery`, `searchResults`, `isSearching`, `searchError`.

**Claves de localStorage:** `misCanciones` — array de objetos `{ id, title, artist, content, songsterrId }`.

**Dependencias externas:** API pública de Songsterr (vía proxy allorigins.win).

### 2. Theory (`/teoria`) — Teoría Musical Interactiva

**Propósito:** Impartir lecciones de teoría musical con laboratorios interactivos usando @tonaljs/tonal.

**Estructura:**
- Sidebar izquierdo con 3 niveles y 11 lecciones.
- Visor derecho que renderiza la lección activa vía `switch`.
- Las lecciones 10 y 11 son laboratorios interactivos con selectores y cómputo en tiempo real.

**Laboratorios:**
- **Lab 10 (Escalas):** Selectores de nota raíz y tipo de escala. Usa `Scale.get()` de tonal.js para calcular las notas. Las muestra traducidas al español vía `enToEs` map.
- **Lab 11 (Acordes):** Selectores de nota raíz y tipo de acorde. Usa `Chord.get()` para obtener intervalos y notas.

**Estados locales:** `activeLesson`, `scaleRoot`, `scaleType`, `chordRoot`, `chordType`.

**Dependencias externas:** `@tonaljs/tonal` (Scale, Chord, Note).

### 3. Practice (`/practica`) — Gimnasio Multidisciplinario

**Propósito:** Entrenamiento con metrónomo y tarjetas flash para 4 disciplinas.

**Disciplinas:**
- **CHORDS:** 14 acordes mayores/menores (seleccionables vía checkboxes).
- **POWER_CHORDS:** 7 power chords (C5-B5).
- **SPIDER:** 8 ejercicios de digitación (1-2-3-4, 4-3-2-1, etc.).
- **PENTATONIC:** 5 cajas pentatónicas.

**Motor de metrónomo:**
- Usa `setInterval` con intervalo `(60 / rpm) * 1000` ms.
- Por cada tick genera un clic usando Web Audio API (oscilador square wave, 800 Hz normal, 1200 Hz acento).
- Cada 4 ticks avanza al siguiente ejercicio (flash-card).
- El `AudioContext` se crea lazy y se reanuda en la interacción del usuario.

**Diafragma SVG:**
- Integra `<ChordDiagram chordName={...} />` para acordes y power chords.
- Muestra hints de tonal.js y preview del siguiente ejercicio.

**Estados locales:** `practiceMode`, `isPlaying`, `rpm`, `selectedChords`, `showHints`, `showNext`, `showDiagram`, `currentItem`, `nextItem`, `tick`.

**Claves de localStorage:** No usa (todo es estado efímero de sesión).

### 4. Routines (`/rutinas`) — Constructor de Rutinas

**Propósito:** Crear, guardar y ejecutar rutinas de práctica cronometradas.

**Tres vistas manejadas por estado local `view`:**
- **DASHBOARD:** Lista de rutinas guardadas + 2 rutinas por defecto (hardcoded).
- **BUILDER:** Formulario para crear rutinas (nombre + lista de ejercicios con duración).
- **PLAYER:** Temporizador con cuenta regresiva por ejercicio. Auto-avanza al siguiente al llegar a 0.

**Motor de temporizador:**
- `setInterval` de 1 segundo.
- `useRef` para el identificador del timer (limpieza en efecto).
- `formatTime()` convierte segundos a formato `m:ss`.

**Estados locales:** `view`, `dbRoutines`, `loading`, `newRoutineName`, `newExercises`, `currentExName`, `currentExDuration`, `activeRoutine`, `currentExerciseIndex`, `timeLeft`, `isPaused`.

**Claves de localStorage:** `misRutinasMusicales` — array de objetos `{ id, name, exercises: [{ name, durationMinutes }] }`.

---

## Componentes Compartidos

### ChordDiagram.jsx — Motor de Renderizado SVG

Renderiza un diapasón de guitarra de 6 cuerdas y 4 trastes usando SVG paramétrico puro.

**Diccionario `chordShapes`:**
- Mapa de nombres de acordes a arrays de 6 elementos (uno por cuerda, de MI a mi).
- Valores: `-1` (muda), `0` (suelta), `>0` (traste a pisar).

**Lógica de ventana:**
- Si algún dedo está más allá del traste 4, calcula `startFret` como el traste mínimo pisado.
- Los círculos verdes (`#1DB954`) se posicionan en coordenadas `(cx, cy)` relativas al `startFret`.

**Props:** `chordName` (string).

---

## Flujo de Datos

```
Acción del Usuario
    ↓
  useState / useReducer
    ↓
  localStorage.getItem / setItem  ←→  Render (JSX)
    ↓
  APIs Web (fetch, AudioContext, SVG DOM)
```

- Sin estado global (no Redux, no Context API).
- Cada página es autocontenida con sus propios `useState`.
- La persistencia se maneja manualmente: cada mutación → `setItem` → carga inicial con `getItem`.
- Las búsquedas a Songsterr usan fetch a un proxy público (no hay backend propio).

---

## Arquitectura de Estilos

- **index.css:** Estilos base del template Vite (reset, tipografía, layout `#root`). Tema claro/oscuro según preferencia del sistema.
- **App.css:** Todos los estilos de la aplicación (~476 líneas). Usa CSS custom properties (`--bg-color`, `--primary-color`, `--card-bg`). Tema oscuro fijo con acento verde `#1DB954` (inspirado en Spotify).
- **ChordDiagram.css:** Estilos específicos del diagrama SVG (22 líneas).
- Estrategia: CSS vanilla sin preprocesadores ni CSS-in-JS.

---

## Despliegue (Vercel)

`vercel.json` define una regla de rewrite:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Esto garantiza que el enrutamiento client-side de React Router funcione correctamente: cualquier ruta (`/teoria`, `/practica`, etc.) sirve `index.html` y deja que React maneje la navegación.

**Scripts de build:**
- `npm run dev` — Servidor de desarrollo Vite.
- `npm run build` — Build producción a `frontend/dist/`.
- `npm run preview` — Preview local del build.
- `npm run lint` — ESLint sobre todo el código fuente.

---

## Decisiones Arquitectónicas Clave

### 1. Serverless SPA (eliminación del backend Java)

Originalmente el proyecto tenía un backend Spring Boot con H2 Database. Se eliminó por completo para reducir costos de hosting a $0. La contrapartida: los datos solo existen en el navegador del usuario.

### 2. localStorage como base de datos

Se eligió `localStorage` sobre IndexedDB por simplicidad. La desventaja es que borrar la caché del navegador destruye todos los datos del usuario.

### 3. Proxy CORS público (allorigins.win)

En lugar de mantener un proxy backend propio, se usa el servicio público `api.allorigins.win` para evitar el bloqueo CORS del navegador al consultar la API de Songsterr.

### 4. SVG paramétrico vs librerías externas

El diapasón se renderiza con SVG inline calculado desde arrays de números, en lugar de usar librerías como `react-guitar` o imágenes estáticas. Ahorra ancho de banda y permite escalado infinito.

### 5. @tonaljs/tonal para teoría musical

Se usa esta librería especializada para todo el cómputo musical (escalas, acordes, intervalos) en lugar de implementar la lógica manualmente.

---

## Seguridad

- No se almacenan credenciales, tokens ni datos sensibles.
- Las únicas APIs externas son: allorigins.win (proxy) y Songsterr (búsqueda de tablaturas).
- No hay formularios de autenticación ni recolección de datos personales.
- Todas las operaciones ocurren en el contexto del navegador del usuario.

---

## Limitaciones Conocidas

- **Pérdida de datos:** Borrar localStorage del navegador elimina canciones y rutinas guardadas.
- **Dependencia de allorigins.win:** Si el servicio público deja de funcionar, la búsqueda de Songsterr se rompe.
- **Sin tests automatizados:** El proyecto no cuenta con suite de pruebas.
- **Sin modo offline completo:** Aunque los datos locales funcionan sin conexión, la búsqueda de Songsterr y los mapas de tonal.js requieren red (la librería está empaquetada en el build, pero las fuentes de datos externas no).

---

## Próximas Mejoras Potenciales

1. Agregar IndexedDB como capa de persistencia alternativa (mayor capacidad, estructura más rica).
2. Implementar un modo offline completo con Service Workers.
3. Migrar a TypeScript para mejor seguridad de tipos.
4. Agregar tests automatizados con Vitest + React Testing Library.
5. Reemplazar allorigins.win con una Vercel Function propia para mayor confiabilidad.
6. Agregar autenticación y sincronización en la nube (Firebase, Supabase).
