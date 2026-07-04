# AGENTS.md — Instrucciones para Asistentes IA

## Identidad del Proyecto

MusicLearner es una SPA 100% frontend para guitarristas. Sin backend, sin base de datos remota. Todo corre en el navegador.

## Stack

- **React 19** con hooks funcionales
- **React Router DOM v7** (rutas: `/`, `/teoria`, `/practica`, `/rutinas`)
- **Vite 8** (build tool)
- **@tonaljs/tonal v4** (cómputo musical)
- **localStorage** (persistencia)
- **Web Audio API** (metrónomo)
- **SVG inline** (diapasón)
- **CSS vanilla** con custom properties (tema oscuro + verde `#1DB954`)
- **allorigins.win** (proxy CORS para Songsterr)
- **ESLint 9** (flat config)

## Convenciones de Código

- **Idioma:** Todo el código y UI en español (variables, comentarios, strings visibles al usuario).
- **Componentes:** Funcionales con `export default`.
- **Estados locales:** `useState` por página, sin estado global (no Redux, no Context API).
- **Persistencia:** Claves en localStorage → `misCanciones`, `misRutinasMusicales`.
- **Nombres de archivos:** PascalCase para componentes (`ChordDiagram.jsx`), camelCase para el resto.
- **Estilos:** CSS en `App.css` (global) o archivo `.css` específico por componente.
- **No usar TypeScript** (el proyecto es JSX puro).
- **No añadir comentarios** a menos que sean necesarios para claridad.
- **Mantener el tono didáctico y creativo** del contenido existente (emojis, metáforas, estilo desenfadado en textos educativos).

## Comandos Importantes

```bash
cd frontend
npm install        # Instalar dependencias
npm run dev        # Servidor de desarrollo (localhost:5173)
npm run build      # Build producción
npm run lint       # ESLint
```

## Estructura de Archivos

```
frontend/
  src/
    main.jsx          # Entry point (no tocar a menos que sea necesario)
    App.jsx           # Componente raíz + router
    App.css           # Estilos principales (~476 líneas)
    index.css         # Estilos base (template Vite)
    components/
      Navbar.jsx      # Barra de navegación
      ChordDiagram.jsx # Motor SVG del diapasón
      ChordDiagram.css # Estilos del diagrama
    pages/
      Library.jsx     # Tablaturas + búsqueda Songsterr
      Theory.jsx      # Lecciones + laboratorios tonal.js
      Practice.jsx    # Gimnasio con metrónomo
      Routines.jsx    # Constructor + reproductor de rutinas
```

## Reglas Arquitectónicas

1. **No agregar backend** — El proyecto es serverless por decisión deliberada.
2. **No agregar dependencias pesadas** — Preferir soluciones vanilla/livianas.
3. **localStorage es la única persistencia** — Usar claves `misCanciones` y `misRutinasMusicales`.
4. **CORS evasion** — Usar `api.allorigins.win/raw?url=...` para consultas externas.
5. **SVG paramétrico** — No cambiar a imágenes estáticas o librerías externas para el diapasón.

## Lo Que NO Hacer

- No cambiar `index.html` a menos que sea estrictamente necesario (corregir `lang="en"` a `lang="es"` sería apropiado).
- No migrar a TypeScript sin consultar.
- No agregar autenticación, cuentas de usuario ni sincronización en la nube.
- No refactorizar el CSS a un framework (Tailwind, styled-components, etc.).
- No eliminar emojis del contenido educativo.
