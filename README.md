# PetLogiLink-API: Sistema de Automatización Logística e Integración Multicanal

![Java](https://img.shields.io/badge/Java-17-orange.svg) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg) ![Maven](https://img.shields.io/badge/Build-Maven-blue.svg)

## 📌 Descripción del Proyecto

**PetLogiLink-API** es una plataforma backend desarrollada en **Java 17 con Spring Boot**, diseñada para orquestar de manera eficiente la logística, la sincronización de inventarios y la automatización SEO para un ecosistema de e-commerce.

Este proyecto nace de la necesidad de automatizar procesos de negocio complejos, integrando canales de venta masivos (Amazon, Miravia) con el inventario de proveedores (B2B), aplicando inteligencia artificial basada en reglas para la optimización de catálogos.

### 🚀 Características Principales (Core Domains)

1. **Sincronización de Stock en Tiempo Real (Cron/Batch):** Un motor asíncrono (`@Scheduled`) que simula la lectura de un feed de datos del proveedor, aplica márgenes de ganancia (15%) dinámicamente y actualiza el inventario local.
2. **Automatización SEO (Simulación IA):** Un servicio de integración que categoriza productos automáticamente mediante reglas lógicas (perro, gato, accesorios) para generar *meta-descripciones* y palabras clave optimizadas, reduciendo el trabajo manual del equipo de marketing.
3. **API Multicanal para Pedidos:** Un controlador REST unificado para ingerir webhooks de pedidos procedentes de plataformas externas (Amazon, Miravia) asegurando un tracking centralizado.

---

## 🏗️ Arquitectura y Stack Tecnológico

El proyecto está diseñado bajo un modelo de arquitectura limpia y escalable:

- **Framework Core:** Spring Boot 3.2.x (Spring Web, Spring Validation).
- **Lenguaje:** Java 17
- **Gestor de Dependencias:** Maven
- **Estructura:**
  - `controller`: Expone las APIs REST.
  - `service`: Contiene la lógica de negocio, incluyendo servicios simulados de IA (`AISeoService`) y tareas Cron (`StockSyncService`).
  - `repository`: Capa de persistencia (simulada In-Memory con `ConcurrentHashMap` para despliegue sin dependencias).
  - `dto` & `model`: Transferencia de datos y Entidades de dominio.

---

## 🛠️ Instalación y Ejecución Local

Para mantener el proyecto extremadamente ágil, no requiere de base de datos externa ni de variables de entorno complejas para su primer arranque (utiliza *Mocks* y colecciones concurrentes en memoria).

### Prerrequisitos
- Java JDK 17 o superior.
- Maven (Opcional si tu IDE lo trae integrado).

### Pasos
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/PetLogiLink-API.git
   cd PetLogiLink-API
   ```
2. Compila y ejecuta el proyecto con Maven:
   ```bash
   mvn spring-boot:run
   ```
3. El servidor arrancará en `http://localhost:8080`. Cada 5 minutos verás en los logs cómo se ejecuta la tarea asíncrona de sincronización de stock y optimización SEO.

---

## 📡 Documentación de la API (Endpoints Principales)

### 1. Recibir un Pedido de Integración Externa
Ingesta de pedidos desde canales como Amazon o Miravia.

- **URL:** `/api/v1/integrations/orders`
- **Método:** `POST`
- **Headers:** `Content-Type: application/json`

**Ejemplo de Petición (Request Body):**
```json
{
  "orderId": "AMZ-9988-7766",
  "sourceChannel": "AMAZON",
  "customerName": "Juan Pérez",
  "shippingAddress": "Calle Mayor 12, Madrid, España",
  "totalAmount": 45.90,
  "items": [
    {
      "sku": "SKU-1002",
      "quantity": 2,
      "unitPrice": 22.95
    }
  ]
}
```

**Ejemplo de Respuesta (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Pedido ingresado al sistema logístico con éxito",
  "internalLogId": "a1b2c3d4-e5f6-7890-1234-56789abcdef0"
}
```

### 2. Consultar Logs de Pedidos Procesados
Permite ver el registro en memoria de todos los pedidos ingeridos.

- **URL:** `/api/v1/integrations/orders/logs`
- **Método:** `GET`

---

## 🔐 Nota sobre Confidencialidad y Portafolio

Este proyecto ha sido re-escrito y diseñado específicamente como un caso de estudio (Showcase) para fines demostrativos. 
- Las credenciales reales, tokens y URLs de producción han sido extraídos o reemplazados por perfiles mock (`application-dev.yml`).
- Se ha sustituido la conexión a base de datos de producción por repositorios `In-Memory` para facilitar la evaluación de la arquitectura y el código sin requerir configuración de infraestructura externa.
- Toda la lógica refleja soluciones arquitectónicas basadas en retos reales de e-commerce y logística.
