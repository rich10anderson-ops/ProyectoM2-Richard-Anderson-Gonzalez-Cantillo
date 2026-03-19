const express = require('express');
require('dotenv').config();
const { loadEnvFile } = require('node:process');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));
const { validateEnv } = require('./config/validateEnv');
const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const { errorHandler } = require('./src/errorHandler');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  try {
    loadEnvFile(envPath);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

try {
  validateEnv();
} catch (err) {
  if (err.code === 'ENV_MISSING') {
    console.warn('Variables de entorno faltantes, usando valores del entorno si existen');
  } else {
    throw err;
  }
}

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

app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
