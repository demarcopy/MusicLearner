# 🏗️ Arquitectura del Sistema: MusicLearner

Este documento detalla las decisiones de ingeniería detrás del proyecto en su etapa actual.

## 1. Evolución: De Monolito Java a Serverless SPA

Originalmente, MusicLearner nació como un ecosistema monolítico tradicional:
- **Backend Central:** Spring Boot (Java 17).
- **Base de Datos:** H2 Database / SQL Relacional.
- **Frontend Cliente:** React CLI.

Sin embargo, para abaratar los costos de hosteo de un sistema de aficionado a **$0.00**, lograr independizar el frontend, y garantizar tiempos de carga de la web de 0.0ms ("PWA Instant load"), **se tomó la decisión arquitectónica de decapitar la cabeza del proyecto y eliminar por completo el Backend de Java de la historia del código.**

## 2. Solución a los 2 problemas del Paradigma Frontend-Only

Al remover el esqueleto de backend, el frontend quedó temporalmente inútil ante las redes mundiales. Para revivirlo y potenciarlo, aplicamos las siguientes técnicas modernas:

### A. Persistencia de Datos (¿Dónde guardar Canciones y Rutinas?)
En lugar de lanzar bucles de carga por consultas `FETCH / POST` a una base de datos SQL remota que costaba dinero mensual proveer, diseñamos una red de repositorios reactivos locales que serializan objetos JSON y los envigan directamente mediante la API `localStorage` integrada en todo V8 Engine (El navegador del usuario).
- **Ventaja:** Funciona completamente offline en lugares sin conexión. La privacidad es soberana (nadie más que el dueño del dispositivo puede ver lo que estudia o toca), y carece de costos por tráfico de transacciones de base de datos.
- **Desventaja:** Limpiar brutalmente la caché del navegador destruye la información y anula la rutina, forzando la creación de una nueva desde cero.

### B. Evasión del Bloqueo CORS en las Búsquedas
Los navegadores de internet modernos por seguridad estricta, bloquean severamente cualquier código JavaScript que intente asomillar comandos FETCH asíncronos hacia un dominio web distinto al suyo (Cross-Origin Resource Sharing). Originalmente, usábamos el Controlador Java Spring como "Mensajero intermedio" para esconder y enmascarar nuestra huella de petición y que la empresa de tablaturas (Songsterr) nos permitiera descargar el archivo de acordes.
**La Nueva Solución Serverless:** Instrumentamos el uso nativo de una infraestructura Open-Source llamada "AllOrigins" (`api.allorigins.win`). Operando como puente o Bridge, nuestro React envía ahora la petición al puente libre público que no requiere llaves maestras, el puente rebota la instrucción a Songsterr desde servidores no auditados por navegador, descarga el cuerpo estático e hidrata exitosamente los mapas de nuestro código de React, logrando eludir el protocolo y mantener la búsqueda de canciones totalmente funcional sin servidor dedicado.

## 3. Geometría Gráfica: El SVG Paramétrico Fretboard Engine

En lugar de delegar el core-visual de la instrucción de la guitarra importando librerías genéricas obsoletas desarrolladas por terceros (Como `react-guitar` o miles de `.png` estáticos pesados por cada nota tonal), decidimos construir un micromotor de renderizado vectorial paramétrico nativo inyectado crudo al Frontend.

El componente arquitectónico `ChordDiagram.jsx` inyecta etiquetas abstractas nativas matematicas `<svg>` directas al DOM de Google Chrome. Interpreta de diccionarios locales y lee estructuras matriciales de estado de tipo `[-1, 3, 5, 5, 4, 3]`. Mediante restas operacionales iterativas, el componente calcula en tiempo real el desplazamiento visual de las cejillas superiores (barre chords), y posiciona individualmente cada coordenada geométrica de los dedos `(CX, CY)` sobre el diapasón vectorial re-escala de madera abstracta negra, imprimiendo resultados hiper-rígidos que nunca pixelan, todo sin costar ni un mínimo megabyte de ancho de banda o transferencia.
