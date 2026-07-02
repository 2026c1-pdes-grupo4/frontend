# UNQ - PDES - 2026 c1
## Aplicación Compra tu Hogar (CTH)

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

### Requisitos
- Node 22+
- Backend corriendo en `http://localhost:8080`

### Instalar dependencias
```bash
npm install
```

### Modo desarrollo
```bash
npm run dev
```

### docker
```bash
docker compose up
```

---

## Variables de entorno
En un archivo .env

| Variable | Descripción | Por defecto |
|---|---|---|
| `VITE_API_URL` | URL base del backend | `http://localhost:8080` |
| `VITE_USE_FIXTURES` | Usar datos locales en lugar del backend real | `false` |
| `BASE_URL` | URL del frontend usada por los tests E2E | `http://localhost:5173` |
| `E2E_AGENCY_USER` | Usuario de agencia para login en E2E | `inmo3` |
| `E2E_AGENCY_PASS` | Contraseña de agencia para login en E2E | `agency123` |

---

## Tests E2E
```bash
# tests solamente
npm run e2e

# dev mode & tests
npm run e2e:ci
```

En CI se ejecuta con `VITE_USE_FIXTURES=true`, no requiere backend.

