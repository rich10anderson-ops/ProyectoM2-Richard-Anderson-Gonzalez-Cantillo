const { Pool } = require('pg');
require('dotenv').config();

function buildPoolConfig(env = process.env) {
  if (env.DATABASE_URL) {
    // Railway/Hobby PG suele requerir SSL; permitir desactivarlo con PGSSLMODE=disable
    const ssl = env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false };
    return { connectionString: env.DATABASE_URL, ssl };
  }

  const required = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const missing = required.filter((k) => !env[k]);
  if (missing.length) {
    const err = new Error(`Faltan variables de entorno: ${missing.join(', ')} o usa DATABASE_URL`);
    err.code = 'ENV_MISSING';
    throw err;
  }

  return {
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  };
}

// Permitir inyectar pool en tests
if (global.__TEST_POOL__) {
  module.exports = global.__TEST_POOL__;
  module.exports.buildPoolConfig = buildPoolConfig;
  return;
}

const pool = new Pool(buildPoolConfig());

module.exports = pool;
module.exports.buildPoolConfig = buildPoolConfig;
