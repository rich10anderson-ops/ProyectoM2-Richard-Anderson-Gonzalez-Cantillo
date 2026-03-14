const express = require('express');
require('dotenv').config();
const { loadEnvFile } = require('node:process');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));
const { validateEnv } = require('./config/validateEnv');
const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');

loadEnvFile(path.join(__dirname, '.env'));
validateEnv();

const app = express();

app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.json({
    message: 'Blog API',
    endpoints: {
      authors: '/api/authors',
      posts: '/api/posts',
      comments: '/api/comments',
    },
  });
});

app.use('/api/authors', authorsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  let status = err.status || 500;
  let message = err.message || 'Error interno del servidor';

  if (err.code === '42P01') {
    message = 'Base de datos no inicializada. Ejecuta npm run db:setup';
  } else if (err.code === 'ECONNREFUSED') {
    message = 'No se pudo conectar a PostgreSQL. Revisa .env y que mantenga servicio activo';
  }

  res.status(status).json({ error: message });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
