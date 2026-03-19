# Blog API (Express + PostgreSQL)

API REST para autores, posts y comentarios con Node.js + Express. Incluye esquema PostgreSQL, validaciones solidas, manejo centralizado de errores y tests con Vitest + Supertest (base en memoria con `pg-mem`).

## Requisitos
- Node.js 18+
- PostgreSQL accesible (local o servicio gestionado como Railway)

## Configuracion local
1. Clonar y crear `.env` a partir de `.env.example`.
   Opcion 1: `DATABASE_URL=postgres://user:pass@host:5432/db`
   Opcion 2: variables sueltas `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
2. Instalar dependencias: `npm install`.
3. Preparar base de datos (crea tablas y seed): `npm run db:setup`.
   Para una base de pruebas separada: crea `.env.test` y ejecuta `npm run db:test`.
4. Levantar la aplicacion:
   Produccion/local: `npm start`
   Desarrollo con recarga: `npm run dev`

## Endpoints
- `/` ping con links.
- CRUD `/api/authors`, `/api/posts`, `/api/comments`.
- Respuestas JSON consistentes con manejo semantico de errores `400`, `404`, `409` y `500`.

## Tests
- Ejecutar: `npm test`.
- La suite principal usa `pg-mem`, por lo que no requiere PostgreSQL real.
- Si quieres preparar una base real de pruebas, puedes usar `npm run db:test`.

## OpenAPI
- Archivo: `openapi.yaml`.
- Swagger UI: iniciar la app y abrir `http://localhost:3000/api-docs`.
- Alternativa local: `npx redoc-cli serve openapi.yaml`.

## Diagramas
- Arquitectura general:
  ![Arquitectura](docs/img/architecture.svg)
- Flujo de request y errores:
  ![Flujo de request](docs/img/request-flow.svg)

## Uso de IA en el proyecto

Se utilizo IA como apoyo tecnico para aclarar conceptos de PostgreSQL, reforzar decisiones de implementacion y ayudar en el diagnostico de errores durante el desarrollo y las pruebas.

### 1. Apoyo conceptual sobre `RETURNING`
<img src="docs/img/captura 1.png.png" alt="Uso de RETURNING en Node.js" width="720" />

Texto sugerido: esta consulta se utilizo para comprender como aplicar `RETURNING` en operaciones `INSERT` dentro de Node.js y PostgreSQL, evitando consultas extra despues de crear registros.

### 2. Ejemplos practicos de `INSERT + RETURNING`
<img src="docs/img/captura 2.png.png" alt="Ejemplos de RETURNING en PostgreSQL" width="720" />

Texto sugerido: aqui la IA apoyo con ejemplos practicos de `RETURNING`, lo que permitio reforzar una implementacion mas clara y eficiente en endpoints de creacion.

### 3. Contexto de errores en pruebas
<img src="docs/img/captura 3.png.png" alt="Errores detectados durante las pruebas" width="720" />

Texto sugerido: esta evidencia muestra el uso de IA para interpretar la salida de errores en la suite de pruebas y orientar el analisis del problema antes de aplicar el fix correspondiente.

### 4. Apoyo para corregir tests HTTP
<img src="docs/img/captura 4.png.png" alt="Correccion sugerida para pruebas con supertest" width="720" />

Texto sugerido: en esta etapa la IA se utilizo para detectar una causa puntual en los tests y sugerir una correccion relacionada con la importacion y uso de `supertest`.

## DOCUMENTACIÓN USO DE IA:
- `docs/img/captura 1.png`
- `docs/img/captura 2.png`
- `docs/img/captura 3.png`
- `docs/img/captura 4.png`

## Deployment en Railway:
1. Crear proyecto en Railway y añadir servicio PostgreSQL.
2. Configurar variables en el servicio Node:
   `DATABASE_URL` o `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
   `PORT`
   `PGSSLMODE=disable` solo si necesitas desactivar SSL
3. Ejecutar migraciones y seed en Railway: `railway run npm run db:setup`.
4. Desplegar la API con `npm start`.
5. Usar la Internal URL para comunicacion entre servicios y la Public URL para clientes externos y `/api-docs`.
