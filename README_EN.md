# PetLogiLink — Fullstack Logistics Automation Platform

*🇪🇸 [Leer en Español](./README.md)*

![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)
![Angular](https://img.shields.io/badge/Angular-18-DD0031.svg)
![Maven](https://img.shields.io/badge/Build-Maven-blue.svg)

## Description

**PetLogiLink** is a fullstack platform designed to orchestrate logistics, inventory synchronization and SEO automation for a multichannel e-commerce ecosystem (Amazon, Miravia).

The project integrates a **Java/Spring Boot** backend with an **Angular 18** frontend, simulating a real-world logistics operations environment where warehouse operators can monitor orders, manage stock and query system events from a visual dashboard.

## Repository Structure

```
PetLogiLink/
├── backend/                  # REST API · Java 17 + Spring Boot 3
│   ├── src/main/java/
│   │   └── com.jhostyn.petlogilink
│   │       ├── controller/   # REST endpoints (orders, health check)
│   │       ├── service/      # Business logic (sync, AI/SEO)
│   │       ├── repository/   # In-Memory persistence (ConcurrentHashMap)
│   │       ├── dto/          # Data transfer objects
│   │       └── model/        # Domain entities
│   └── pom.xml
│
├── frontend/                 # Dashboard · Angular 18 + Chart.js
│   └── src/app/
│       ├── features/
│       │   ├── login/        # Authentication with route guards
│       │   ├── dashboard/    # KPIs and charts by marketplace
│       │   ├── inventory/    # Interactive table with filters and inline editing
│       │   └── logs/         # Real-time event terminal
│       ├── core/services/    # AuthService, ApiService (reactive state)
│       └── shared/layout/    # Sidebar + Topbar (main navigation)
│
└── README.md
```

## Backend Features

**Stock Synchronization (Cron/Batch)**

Asynchronous engine with `@Scheduled` that simulates reading a B2B supplier feed, applies dynamic profit margins (15%) and automatically updates the local inventory.

**SEO Automation**

Product categorization service using logical rules (dog, cat, accessories) that generates optimized meta-descriptions and keywords, reducing manual work for the marketing team.

**Multichannel Order API**

Unified REST controller for ingesting order webhooks from Amazon and Miravia, with centralized tracking and data validation.

## Frontend Features

**Metrics Dashboard** — Doughnut and bar charts (Chart.js) showing order distribution by marketplace and time slot.

**Interactive Inventory** — Table with pagination, SKU/EAN/name filters, stock indicators and inline price editing.

**Real-Time Logs** — Event feed from the `@Scheduled` task (StockSyncService) and multichannel webhook simulation.

**Login System** — Authentication form with Angular route guards and session storage.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Java 17, Spring Boot 3, Spring Web, Spring Validation |
| Frontend | Angular 18, TypeScript, Chart.js, SCSS |
| Persistence | In-Memory (ConcurrentHashMap) — zero external dependencies |
| Build | Maven (backend), Angular CLI + npm (frontend) |

## Getting Started

### Prerequisites
- Java JDK 17+
- Maven
- Node.js 18+ and npm (for the frontend)

### Backend
```bash
git clone https://github.com/JhostynRosales/petlogilink-api.git
cd petlogilink-api/backend
mvn spring-boot:run
```
The server will start on `http://localhost:8080`. The stock synchronization task runs automatically every 5 minutes.

### Frontend
```bash
cd petlogilink-api/frontend
npm install
npm start
```
The dashboard will be available at `http://localhost:4200`. Login credentials: `admin` / `admin123`.

## API Endpoints

### Receive an Order (Webhook)
- **POST** `/api/v1/integrations/orders`

```json
{
  "orderId": "AMZ-9988-7766",
  "sourceChannel": "AMAZON",
  "customerName": "Juan Pérez",
  "shippingAddress": "Calle Mayor 12, Madrid, Spain",
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

**Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Order successfully ingested into the logistics system",
  "internalLogId": "a1b2c3d4-e5f6-7890-1234-56789abcdef0"
}
```

### Query Order Logs
- **GET** `/api/v1/integrations/orders/logs`

## Confidentiality Notice

This project has been developed as a case study for demonstration purposes.

- Production credentials, tokens and URLs have been extracted or replaced with mock profiles (`application-dev.yml`).
- The production database connection has been replaced with In-Memory repositories to facilitate evaluation without requiring external infrastructure.
- All logic reflects architectural solutions based on real e-commerce and logistics challenges.

## Related Projects

| Repository | Description |
|------------|-------------|
| [notification-microservice](https://github.com/JhostynRosales/notification-microservice) | Asynchronous notification microservice with RabbitMQ and Docker |
