# Blog API (Express + PostgreSQL)

API REST para autores, posts y comentarios con Node.js + Express. Incluye esquema PostgreSQL, validaciones sólidas, manejo centralizado de errores y tests con Vitest + Supertest (base en memoria con `pg-mem`).

## Requisitos
- Node.js 18+
- PostgreSQL accesible (local o servicio gestionado como Railway)

## Configuración local
1) Clonar y crear `.env` a partir de `.env.example`.
   - Opción 1: `DATABASE_URL=postgres://user:pass@host:5432/db`
   - Opción 2: variables sueltas `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
2) Instalar dependencias: `npm install`.
3) Preparar base (crea tablas + seed): `npm run db:setup`.
   - Para una base de pruebas separada: crea `.env.test` y ejecuta `npm run db:test`.
4) Levantar:
   - Prod/local: `npm start` (usa `PORT`, por defecto 3000).
   - Dev con recarga: `npm run dev`.

## Endpoints
- `/` ping con links.
- CRUD `/api/authors`, `/api/posts`, `/api/comments`.
- Errores JSON consistentes `{ error, code? }`, status 400/404/409/500 según el caso.

## Tests
- Ejecutar: `npm test`.
- No requiere PostgreSQL: los tests usan `pg-mem` en memoria e inyectan el pool en la app.

## OpenAPI
- Archivo: `openapi.yaml` (incluye códigos 400/404/409 y esquemas de error `{ error, code? }`).
- Visualizar:
  - Swagger UI: iniciar la app y abrir `http://localhost:3000/api-docs`.
  - O bien `npx redoc-cli serve openapi.yaml`.

## Deployment en Railway
1) Crear proyecto en Railway y añadir servicio PostgreSQL.
2) Variables en el servicio Node:
   - `DATABASE_URL` (recomendado) **o** (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).
   - `PORT` (Railway la inyecta; deja fallback 3000).
   - Si Railway exige SSL, dejar por defecto (usa `rejectUnauthorized: false` con `DATABASE_URL`). Para desactivar SSL: `PGSSLMODE=disable`.
3) Ejecutar migraciones/seed en Railway: `railway run npm run db:setup`.
4) Deploy: Railway ejecuta `npm start`.
5) URLs:
   - Internal URL: usada entre servicios dentro de Railway.
   - Public URL: expuesta a clientes; habilítala en Railway para servir la API y `/api-docs`.
