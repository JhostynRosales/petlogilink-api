# PetLogiLink — Plataforma Fullstack de Automatización Logística

*🇬🇧 [Read in English](./README_EN.md)*

![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)
![Angular](https://img.shields.io/badge/Angular-18-DD0031.svg)
![Maven](https://img.shields.io/badge/Build-Maven-blue.svg)

## Descripción

**PetLogiLink** es una plataforma fullstack diseñada para orquestar la logística, sincronización de inventarios y automatización SEO en un ecosistema de e-commerce multicanal (Amazon, Miravia).

El proyecto integra un backend en **Java/Spring Boot** con un frontend en **Angular 18**, simulando un entorno real de operaciones logísticas donde los operadores de almacén pueden monitorizar pedidos, gestionar stock y consultar eventos del sistema desde un panel visual.

## Estructura del Repositorio

```
PetLogiLink/
├── backend/                  # API REST · Java 17 + Spring Boot 3
│   ├── src/main/java/
│   │   └── com.jhostyn.petlogilink
│   │       ├── controller/   # Endpoints REST (pedidos, health check)
│   │       ├── service/      # Lógica de negocio (sync, IA/SEO)
│   │       ├── repository/   # Persistencia In-Memory (ConcurrentHashMap)
│   │       ├── dto/          # Objetos de transferencia
│   │       └── model/        # Entidades de dominio
│   └── pom.xml
│
├── frontend/                 # Dashboard · Angular 18 + Chart.js
│   └── src/app/
│       ├── features/
│       │   ├── login/        # Autenticación con guard de rutas
│       │   ├── dashboard/    # KPIs y gráficos por marketplace
│       │   ├── inventory/    # Tabla interactiva con filtros y edición inline
│       │   └── logs/         # Terminal de eventos en tiempo real
│       ├── core/services/    # AuthService, ApiService (estado reactivo)
│       └── shared/layout/    # Sidebar + Topbar (navegación principal)
│
└── README.md
```

## Funcionalidades del Backend

**Sincronización de Stock (Cron/Batch)**

Motor asíncrono con `@Scheduled` que simula la lectura de un feed de proveedor B2B, aplica márgenes de ganancia dinámicos (15%) y actualiza el inventario local de forma automática.

**Automatización SEO**

Servicio de categorización de productos mediante reglas lógicas (perro, gato, accesorios) que genera meta-descripciones y keywords optimizadas, reduciendo el trabajo manual del equipo de marketing.

**API Multicanal de Pedidos**

Controlador REST unificado para ingerir webhooks de pedidos procedentes de Amazon y Miravia, con tracking centralizado y validación de datos.

## Funcionalidades del Frontend

**Panel de Métricas** — Gráficos de dona y barras (Chart.js) con distribución de pedidos por marketplace y franja horaria.

**Inventario Interactivo** — Tabla con paginación, filtros por SKU/EAN/nombre, indicadores de stock y edición inline de precios.

**Logs en Tiempo Real** — Feed de eventos del `@Scheduled` (StockSyncService) y simulación de webhooks multicanal entrantes.

**Sistema de Login** — Formulario con autenticación basada en guards de Angular y almacenamiento de sesión.

## Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| Backend | Java 17, Spring Boot 3, Spring Web, Spring Validation |
| Frontend | Angular 18, TypeScript, Chart.js, SCSS |
| Persistencia | In-Memory (ConcurrentHashMap) — sin dependencias externas |
| Build | Maven (backend), Angular CLI + npm (frontend) |

## Instalación

### Prerrequisitos
- Java JDK 17+
- Maven
- Node.js 18+ y npm (para el frontend)

### Backend
```bash
git clone https://github.com/JhostynRosales/petlogilink-api.git
cd petlogilink-api/backend
mvn spring-boot:run
```
El servidor arrancará en `http://localhost:8080`. Cada 5 minutos se ejecuta automáticamente la tarea de sincronización de stock.

### Frontend
```bash
cd petlogilink-api/frontend
npm install
npm start
```
El panel estará disponible en `http://localhost:4200`. Credenciales de acceso: `admin` / `admin123`.

## Endpoints de la API

### Recibir un Pedido (Webhook)
- **POST** `/api/v1/integrations/orders`

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

**Respuesta (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Pedido ingresado al sistema logístico con éxito",
  "internalLogId": "a1b2c3d4-e5f6-7890-1234-56789abcdef0"
}
```

### Consultar Logs de Pedidos
- **GET** `/api/v1/integrations/orders/logs`

## Nota sobre Confidencialidad

Este proyecto ha sido desarrollado como caso de estudio para fines demostrativos.

- Las credenciales, tokens y URLs de producción han sido extraídos o reemplazados por perfiles mock (`application-dev.yml`).
- La conexión a base de datos de producción ha sido sustituida por repositorios In-Memory para facilitar la evaluación sin requerir infraestructura externa.
- Toda la lógica refleja soluciones arquitectónicas basadas en retos reales de e-commerce y logística.

## Proyectos Relacionados

| Repositorio | Descripción |
|-------------|-------------|
| [notification-microservice](https://github.com/JhostynRosales/notification-microservice) | Microservicio de notificaciones asíncronas con RabbitMQ y Docker |
