# 🏗️ Arquitectura del Backend – MusicLearn

Este proyecto utiliza una **arquitectura en capas (Layered Architecture)**, ampliamente adoptada en aplicaciones empresariales desarrolladas con **Spring Boot**.  
El objetivo principal es **separar responsabilidades**, mejorar la mantenibilidad del código y facilitar la escalabilidad y testeo.

---

## 📦 Estructura de paquetes

com.musiclearn
├── controller
├── service
├── repository
├── model
├── dto
└── external


---

## 🧠 Arquitectura en capas

La aplicación sigue el siguiente flujo lógico:

Controller → Service → Repository → Base de Datos
↓
APIs Externas


Cada capa cumple una responsabilidad específica y **no accede directamente a capas no adyacentes**.

---

## 📁 Descripción de cada paquete

### 🎮 controller
Responsable de:
- Recibir solicitudes HTTP (REST)
- Validar parámetros de entrada
- Devolver respuestas HTTP

No contiene lógica de negocio.


### 🧠 service

Responsable de:

Implementar la lógica de negocio

Coordinar repositorios y servicios externos

Aplicar reglas del dominio

### 🗄️ repository

Responsable de:

Acceso a la base de datos

Operaciones CRUD

Consultas mediante JPA

### 🧱 model
Contiene:

Entidades del dominio

Representación de tablas de la base de datos


### 📦 dto (Data Transfer Objects)
Se utilizan para:

Transferir datos entre capas

Evitar exponer directamente las entidades

Adaptar respuestas para el frontend

### 🌐 external
Responsable de:

Comunicación con APIs externas

Adaptar respuestas externas al dominio interno

Implementa el patrón Adapter / Gateway.


