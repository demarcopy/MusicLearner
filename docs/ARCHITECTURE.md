# 🧠 Arquitectura de MusicLearner

Este documento tiene el principal objetivo de explicar, en palabras amigables pero estrictamente técnicas, cómo "respira" y funciona nuestra aplicación web musical en su interior. Te ayudará a comprender los conceptos detrás de los bloques de código que vienes programando.

## 1. El Modelo "Cliente-Servidor"

Atrás quedaron las épocas donde un programa era "un solo archivo grande". Nuestra aplicación está dividida estratégicamente en dos mundos completamente distintos que "hablan" por internet:

### 📱 El "Cliente" (Frontend)
Todo el código de la carpeta `frontend/`.
- **Trabajo Principal:** Corre exclusivamente en el navegador web del usuario (Chrome, Firefox, Safari). Dibuja los colores, mueve las animaciones, y organiza las métricas de tu pantalla (los acordes, letras y tablaturas).
- **Tecnología:** Escrito en **React**. React permite construir la web no como "páginas gigantes", sino como "piezas de lego" o **Componentes**. Gracias a esto, actualizar una partitura es instantáneo y no requiere presionar *F5* para recargar. (Revisa cómo se usa esa lógica con la palabra `useState` en tu archivo `App.jsx`).

### 🏭 El "Servidor" (Backend)
Todo el código de la carpeta `backend/`.
- **Trabajo Principal:** Guardar los datos permanentemente. Controla quién entra (logins de usuarios), procesa algoritmos pesados y protege la información privada (como qué canciones marcaste de "favoritos").
- **Tecnología:** Escrito en **Java** usando el monstruo corporativo e hiper-estable llamado **Spring Boot**. El servidor nunca expone su código fuente a quienes visitan la página.

---

## 2. ¿Cómo se comunican? (La magia de una "API REST")

Imagina que el Frontend y el Backend están en dos países distintos y necesitan hablarse. No pueden leerse la mente mutuamente, así que usan mensajeros: El protocolo clásico de la web, **HTTP**, y siguen un formato arquitectónico llamado **API REST**.

**Veamos tu primer código como ejemplo paso a paso:**
1. Al abrir la página, **React (Frontend)** pregunta: *"¡Hola servidor! Dime si estás vivo y conectado"*. Lo hace disparando la orden `fetch("http://localhost:8080/api/hello")` en tu archivo `App.jsx`.
2. Ese mensaje viaja invisible por dentro de tu PC, toca la puerta del puerto 8080 y es recibido en **Java (Spring Boot)**.
3. Spring Boot lee la dirección que le enviaste (`/api/hello`) y se la entrega al que anotaste con ese pase, en este caso a tu archivo `TestController.java` porque lleva la etiqueta (anotación) `@GetMapping("/hello")`.
4. El método dentro de ese Controller agarra la solicitud y "fabrica" un paquete de respuesta (el saludo). Como Java no habla "idioma web", empaqueta ese mensaje en un lenguaje de texto ultraligero y universal que usan los equipos informáticos, llamado **JSON**.
5. Tu frontend (React) toma de regreso esa caja JSON, lee su mensaje adentro, y te pinta ese bonito texto en color verde (`<p>{message}</p>`). Y todo esto pasa en décimas de segundo.

---

## 3. Radiografía Interna de Java (Capas de tu Backend)

Para no construir un archivo de texto inmenso, el backend en la industria moderna no mezcla funciones a lo loco, se estructura en **Capas** o paquetes bien delimitados. Tu estructura tiene estas responsabilidades de "oficina":

1. **`controllers` (Los Recepcionistas):** Las clases que reciben peticiones externas (los GET, POST, DELETE de internet). Escuchan la solicitud, miran que venga bien estructurada y se la derivan a quien corresponda procesarla. *(Anotaciones típicas: `@RestController`, `@RequestMapping`).*
2. **`services` (Los Gerentes Lógicos):** La magia matemática habita aquí. Por ejemplo "Calcular cuánto duran todas las canciones de una tu playlist sumadas" o "Autenticar un login a ver si sirve". Un controlador le "arroja el paciente" al servicio para que ponga la medicina.
3. **`repositories` (Los Diarios Íntimos de la Base de Datos):** Su única función existencial es guardar y extraer filas de nuestras tablas. Hablan directo con tus bases SQL. Con `Spring Data JPA` del que hacemos uso, programar esta capa es casi automático porque Spring sabe pre-escribirlo.
4. **`models` (Entity):** Los planos u objetos puros. Por ejemplo: `public class Song` teniendo propiedades como `{ String id, String title, String artist, String chords }`. Estos a su vez se mapean directamente para ser tus "tablas". 

## 4. El Futuro 
Teniendo este mapa conceptual, el próximo paso normal de los grandes programas es empezar a diseñar bases de datos interactivas y diseñar una UI digna de la mejor plataforma para músicos.
