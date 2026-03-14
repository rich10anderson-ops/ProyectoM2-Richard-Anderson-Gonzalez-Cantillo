const fs = require('fs');
const path = require('path');
const { loadEnvFile } = require('node:process');
const { Pool } = require('pg');

loadEnvFile(path.join(__dirname, '..', '.env'));

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Uso: node db/run-sql.js db/setup.sql [db/seed.sql]');
  process.exit(1);
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function runFile(sqlPath) {
  const sql = fs.readFileSync(sqlPath, 'utf8');
  await pool.query(sql);
  console.log(`✅ Ejecutado ${sqlPath}`);
}

(async () => {
  try {
    for (const file of files) {
      const full = path.resolve(file);
      await runFile(full);
    }
    console.log('✔️  Base de datos lista');
  } catch (err) {
    console.error('Error ejecutando SQL:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
