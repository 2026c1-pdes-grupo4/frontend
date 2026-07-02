# UNQ - PDES - 2026 c1
## Aplicación Compra tu Hogar (CTH)

[![Frontend CI](https://github.com/2026c1-pdes-grupo4/frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/2026c1-pdes-grupo4/frontend/actions/workflows/ci.yml)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=2026c1-pdes-grupo4_frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=2026c1-pdes-grupo4_frontend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=2026c1-pdes-grupo4_frontend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=2026c1-pdes-grupo4_frontend)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

### Frontend

Tecnologías elegidas
- React + Vite + Typescript

Integrantes
- Juan Hualampa
- Sofia Justiniano

---

## Roles

| Rol | Ruta |
|---|---|
| Comprador | `/properties`, `/favorites` |
| Agencia | `/agency` |
| Admin | `/admin` |

---

## Ejecución

Hay tres formas de correr el frontend. Todas requieren un backend accesible en la URL que indique `VITE_API_URL` (default: `http://localhost:8080`).

### Opción 1: Local, sin Docker (desarrollo)

Requisitos: Node 22+.

```bash
npm install
npm run dev
```

Levanta el servidor de Vite con hot-reload en `http://localhost:5173`.

### Opción 2: Docker, target `dev` (equivalente a opción 1, sin instalar nodejs)

Requisitos: Docker.

```bash
docker compose up
```

Usa el target `dev` del `Dockerfile` (`node:22-slim`, corre `npm run dev` dentro del contenedor, con hot-reload vía volumen montado). Disponible en `http://localhost:5173`.

### Opción 3: Docker, target `production` (build real, sin nodejs ni hot-reload)

Requisitos: Docker, y `dist/` ya compilado (el target `production` no compila nada, sólo empaqueta).

```bash
npm install
npm run build
docker build --target production -t cth-frontend .
docker run -p 8081:80 cth-frontend
```

La imagen final es sólo `nginx:1.27-alpine` sirviendo el contenido de `dist/` en el puerto `80` del contenedor (mapeado a `8081`).

> [!NOTE]
> A diferencia de las opciones 1 y 2, `VITE_API_URL` queda fijo dentro del bundle en el momento del `npm run build`, no se puede cambiar después con una variable de entorno al hacer `docker run`.

En CI:
1. **Build & Lint** compila `dist/` y lo sube como artifact
2. **Push Image to GHCR** lo descarga y arma la imagen, publicándola en `ghcr.io/2026c1-pdes-grupo4/frontend`.
---

## Variables de entorno (.env)

| Variable | Descripción | Por defecto |
|---|---|---|
| `VITE_API_URL` | URL base del backend | `http://localhost:8080` |
| `VITE_USE_FIXTURES` | fixture data en lugar del backend real | `false` |
| `HEADED` | Corre los tests E2E con navegador visible (Playwright) | `false` |
| `BASE_URL` | URL del frontend usada por los tests E2E | `http://localhost:5173` |
| `E2E_BUYER_USER` | Usuario comprador para login en E2E | `buyer12` |
| `E2E_BUYER_PASS` | Contraseña de comprador para login en E2E | `buyer123` |
| `E2E_AGENCY_USER` | Usuario de agencia para login en E2E | `inmo1` |
| `E2E_AGENCY_PASS` | Contraseña de agencia para login en E2E | `agency123` |
| `E2E_ADMIN_USER` | Usuario admin para login en E2E | `admin123` |
| `E2E_ADMIN_PASS` | Contraseña de admin para login en E2E | `admin123` |

---

## Unit tests

```bash
npm run test

# watch mode
npm run test:watch

# coverage report (coverage/lcov.info)
npm run test:coverage
```

Corre como parte del job **Build & Lint** en CI.

---

## Tests E2E
```bash
# tests solamente
npm run e2e

# dev mode & tests
npm run e2e:ci
```

En CI (job `e2e`) se ejecuta con `VITE_USE_FIXTURES=false` contra un backend real (MySQL + API en Docker).

---

## Tests de Arquitectura

```bash
npm run test:arch
```

Usa [`dependency-cruiser`](https://github.com/sverweij/dependency-cruiser) para validar las reglas de capas definidas en `.dependency-cruiser.cjs`:

| Regla | Descripción |
|---|---|
| `no-circular` | Sin dependencias circulares |
| `views-must-go-through-controllers` | `views/` no puede importar `services/` directamente |
| `components-stay-presentational` | `components/` no puede depender de `services/`, `views/` ni `controllers/` |
| `services-no-upward-deps` | `services/` no puede depender de `controllers/`, `views/`, `components/` ni `context/` |
| `models-are-leaf` | `models/` no puede depender de ninguna otra capa |

Corre como parte del job **Build & Lint** en CI.

---

## Git Flow

```
| main            producción
├─ develop        integración
| | └ feature/*   nuevas funcionalidades
└ └ fix/*         fixes (de develop o main)
```

**Flujo de trabajo:**

```
feature/* -> PR -> develop -> PR -> main
```
> [!IMPORTANT]
> develop & main disparan pipeline completo
> (build + arch tests + sonar opcional + e2e + push + deploy)


---

## Pipeline CI/CD (`.github/workflows/ci.yml`)
```
Job 1: Build & Lint -> Job 2: SonarCloud -> Job 3: e2e (Playwright)
    (lint + arch tests + build)
        │
Job 4: Push GHCR (solo push a main/develop)
        │
   (solo main)
        |
Job 5: Deploy (TO-DO)
```

La imagen Docker se publica en `ghcr.io/2026c1-pdes-grupo4/frontend`.

