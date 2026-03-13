# Blog API (Express + PostgreSQL)

API REST sencilla para gestionar autores, posts y comentarios con Node.js, Express y PostgreSQL. Pensada para correr en local y desplegar en Railway.

## Requisitos
- Node.js 18+
- PostgreSQL accesible (local o servicio gestionado)

## Configuracion
1. Clona el repo y copia `.env.example` a `.env` con tus valores de DB.
2. Instala dependencias: `npm install`.
3. Prepara la base: `npm run db:setup` (ejecuta `db/setup.sql` y `db/seed.sql`).

## Ejecutar
- Produccion/local: `npm start` (escucha en `PORT`, por defecto 3000).
- Dev con recarga: `npm run dev` (Node --watch).

Endpoints base:
- `GET /` salud y links.
- CRUD `/api/authors`, `/api/posts`, `/api/comments` (ver `openapi.yaml`).

## Tests
- Ejecuta `npm test`.
- En Windows, si falla por permisos: `Set-ExecutionPolicy -Scope Process RemoteSigned` o usa WSL.

## OpenAPI
- Archivo: `openapi.yaml`.
- Puedes abrirlo en https://editor.swagger.io o con `npx redoc-cli serve openapi.yaml`.

## Deployment en Railway (paso a paso)
1. Crear proyecto + servicio Postgres en Railway.
2. Añadir servicio Node con este repo.
3. Variables de entorno (Railway): `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `PORT`.
   - `DB_HOST`: internal host del servicio Postgres.
   - `DB_PORT`: 5432.
   - `DB_NAME/USER/PASSWORD`: credenciales de Postgres.
   - `PORT`: 3000 (Railway inyecta, usa fallback en server).
4. Deploy: Railway builda y ejecuta `npm start`.
5. Internal URL: usada entre servicios dentro de Railway.
6. Public URL: la que expones a clientes (habilita dominio publico en Railway).

## Estructura
- `server.js` arranca la app y monta rutas.
- `routes/authors.js`, `routes/posts.js`, `routes/comments.js` CRUD con pg.
- `db/setup.sql`, `db/seed.sql`, `db/run-sql.js` (setup/seed).
- `src/validators.js` validaciones basicas.
- `tests/*.test.js` unitarios + API con supertest.
- `openapi.yaml` especificacion.
