# 🎶 MusicLearner (Serverless Edition)

MusicLearner es una academia musical y biblioteca de tablaturas interactiva. Ahora configurada como una **Single Page Application (SPA)** 100% Serverless, lo que significa que puedes estructurar tus rutinas, visualizar el mástil de tu guitarra y guardar partituras sin necesidad de instalar o mantener bases de datos complejas.

## 🌟 Características Principales (Módulos)

1. **📚 Biblioteca de Tablaturas:** Integración directa con la base de datos mundial de *Songsterr* usando el puente público de *AllOrigins* para esquivar bloqueos de navegador (CORS). Todas tus partituras favoritas se guardan instantáneamente en tu memoria `localStorage`. 
2. **📖 Teoría Computacional:** Entiende la música mediante laboratorios interactivos impulsados por Inteligencia Artificial Teórica (`Tonal.js`). Construye escalas y acordes desmintiendo mitos.
3. **🎸 Gimnasio Multidisciplinario:** Un motor de gráficos vectoriales (SVG) que dibuja tu mástil para que practiques *Power Chords*, *Arañas* y *Pentatónicas*.
4. **🏋️‍♀️ Constructor de Rutinas:** Diseña tus propios entrenamientos cronometrados.

## 🛠️ Stack Tecnológico

- **Frontend (Interfaz y Lógica):** React, JavaScript, Vite.
- **Renderizado Visual:** Vanilla CSS moderno.
- **Persistencia de Datos:** Web Storage API (`localStorage`).
- **Despliegue Recomendado:** Vercel o Netlify (Zero config, Costo Cero).

---

## 🚀 Cómo ejecutar el proyecto (Localmente)

Como la aplicación ya no depende de un servidor Backend monolítico pesado, iniciarla es cuestión de solo 2 comandos en cualquier computadora del mundo:

1. Abre una terminal y navega a la carpeta principal:
   ```bash
   cd frontend
   ```
2. Instala las dependencias de Node.js (solo si lo acabas de descargar):
   ```bash
   npm install
   ```
3. Arranca el motor de Vite web:
   ```bash
   npm run dev
   ```
4. Ingresa a `http://localhost:5173`. Tus datos anteriores de caché seguirán ahí esperándote.

---

## 🌍 Cómo subir la web a Internet (Host Gratis)

Dado que el servidor de lógica, bases de datos y proxy ahora viven del lado del cliente (**Frontend-Only**), subirla a la internet real te tomará 30 segundos:

1. Sube/Asegúrate de que este código viva en tu repositorio de GitHub.
2. Crea una cuenta en [Vercel.com](https://vercel.com/) o [Netlify.com](https://netlify.com/).
3. Haz clic en **"Import Project / Add New Site"** y selecciona tu repositorio de GitHub.
4. El sistema autodetectará que es una app de "Vite React". No toques nada, y presiona el grandísimo botón de **Depliegue (Deploy)**.
5. ¡Listo! Te otorgarán un enlace web real funcional que podrás probar desde el navegador de tu celular en el gimnasio.
