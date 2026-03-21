# 🎶 MusicLearner

MusicLearner es una aplicación web interactiva diseñada para crear y gestionar tu propia biblioteca musical. Podrás buscar y visualizar tablaturas, guardar tus canciones favoritas y practicar tus habilidades con una interfaz moderna y atractiva orientada a músicos y aprendices.

## 🛠️ Tecnologías Utilizadas

Este proyecto sigue una arquitectura **Full-Stack** moderna (Cliente/Servidor), separando completamente lo visual del procesamiento:

- **Backend (El Cerebro/Servidor):** Java 17, Spring Boot, Spring Web. 
- **Frontend (La Interfaz Web):** React, JavaScript, Vite, CSS puro.
- **Base de Datos:** (En desarrollo) Configurada inicialmente en memoria con H2 para migrar después a PostgreSQL.

---

## 🚀 Cómo ejecutar el proyecto (Modo Desarrollo)

Para hacer funcionar la aplicación en tu computadora, debes iniciar **ambos** servidores por separado al mismo tiempo.

### 1. Iniciar el Backend (Java / Spring Boot)
El servidor maestro de la aplicación, encargado de la base de datos y la seguridad.
1. Abre una terminal o Símbolo del sistema.
2. Ingresa a la carpeta del backend: `cd backend`
3. Ejecuta la aplicación usando el envoltorio de Maven (*mvnw*):
   - **En Windows:** `.\mvnw spring-boot:run`
   - **En Mac/Linux:** `./mvnw spring-boot:run`
4. El backend se levantará y empezará a "escuchar" en la dirección `http://localhost:8080`.

### 2. Iniciar el Frontend (React / Vite)
La parte visual de la web donde harás clic y leerás las partituras.
1. Abre una **segunda terminal diferente**.
2. Ingresa a la carpeta del frontend: `cd frontend`
3. Instala las dependencias (necesario solo si es la primera vez que clonas el código): `npm install`
4. Arranca el servidor de desarrollo web ultra-rápido: `npm run dev`
5. Mantén pulsado `Ctrl` y haz clic izquierdo en la URL que aparece (generalmente `http://localhost:5173`) para ver tu web.

> **¡Misión Cumplida!** React se comunicará inmediatamente con el Spring Boot para mostrar el estado del sistema.

---

## 📚 ¿Quieres entender cómo funciona por dentro? 
Hemos elaborado un documento extenso que explica conceptualmente todo sobre MusicLearner, el rol que cumple cada línea de tu código, y por qué está estructurado de esta manera. 

Lee la documentación técnica diseñada para tu aprendizaje entrando a: [Arquitectura del Sistema](docs/ARCHITECTURE.md).
