const fs = require('fs');
const path = require('path');
const { loadEnvFile } = require('node:process');
const { Pool } = require('pg');
const { buildPoolConfig } = require('./config');

const envFile = process.env.ENV_FILE || (process.env.NODE_ENV === 'test' ? '.env.test' : '.env');
const envPath = path.join(__dirname, '..', envFile);
if (fs.existsSync(envPath)) {
  try {
    loadEnvFile(envPath);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

async function runSqlFiles(files) {
  const pool = new Pool(buildPoolConfig());

  try {
    for (const file of files) {
      const sqlPath = path.isAbsolute(file) ? file : path.join(__dirname, '..', file);
      const sql = fs.readFileSync(sqlPath, 'utf8');
      console.log(`\n>> Ejecutando ${sqlPath}`);
      await pool.query(sql);
    }
    console.log('\n✔ SQL ejecutado correctamente');
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error('Uso: node db/run-sql.js <archivo1.sql> [archivo2.sql ...]');
    process.exit(1);
  }

  runSqlFiles(files).catch((err) => {
    console.error('Error ejecutando SQL:', err.message);
    process.exitCode = 1;
  });
}

module.exports = { runSqlFiles };
