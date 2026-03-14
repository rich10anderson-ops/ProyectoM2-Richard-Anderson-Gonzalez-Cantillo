import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { describe, test } from 'vitest';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

function assertExists(relPath) {
  const fullPath = path.join(projectRoot, relPath);
  assert.ok(fs.existsSync(fullPath), `Falta el recurso esperado: ${relPath}`);
  return fullPath;
}

function readSql() {
  const setupPath = assertExists('db/setup.sql');
  return fs.readFileSync(setupPath, 'utf8');
}

function getTableBlock(sql) {
  return sql; // usamos el SQL completo para las comprobaciones
}

function expectColumn(sql, table, column, pattern) {
  const tableBlock = getTableBlock(sql);
  assert.ok(tableBlock, `No se encontro la tabla ${table}`);
  const regex = new RegExp(`${column}\\s+${pattern}`, 'i');
  assert.ok(regex.test(tableBlock), `La columna ${column} en ${table} no cumple: ${pattern}`);
}

function expectForeignKey(sql, table, column, target) {
  const tableBlock = getTableBlock(sql);
  assert.ok(tableBlock, `No se encontro la tabla ${table}`);
  const fkRegex = new RegExp(`FOREIGN\\s+KEY\\s*\\(${column}\\)\\s+REFERENCES\\s+${target}`, 'i');
  assert.ok(fkRegex.test(tableBlock), `Falta la FK ${column} -> ${target} en ${table}`);
}

describe('schema', () => {
  test('estructura y FKs', () => {
    [
      'server.js',
      'routes/authors.js',
      'routes/posts.js',
      'routes/comments.js',
      'db/config.js',
      'db/setup.sql',
      'db/seed.sql',
      'openapi.yaml',
    ].forEach(assertExists);

    const sql = readSql();

    expectColumn(sql, 'authors', 'id', 'serial\\s+primary\\s+key');
    expectColumn(sql, 'authors', 'name', 'varchar\\(100\\)\\s+not\\s+null');
    expectColumn(sql, 'authors', 'email', 'varchar\\(150\\)\\s+unique\\s+not\\s+null');
    expectColumn(sql, 'authors', 'bio', 'text');
    expectColumn(sql, 'authors', 'created_at', 'timestamptz\\s+default\\s+now\\(\\)');

    expectColumn(sql, 'posts', 'id', 'serial\\s+primary\\s+key');
    expectColumn(sql, 'posts', 'author_id', 'integer\\s+not\\s+null');
    expectColumn(sql, 'posts', 'title', 'varchar\\(200\\)\\s+not\\s+null');
    expectColumn(sql, 'posts', 'content', 'text\\s+not\\s+null');
    expectColumn(sql, 'posts', 'published', 'boolean\\s+default\\s+false');
    expectColumn(sql, 'posts', 'created_at', 'timestamptz\\s+default\\s+now\\(\\)');
    expectForeignKey(sql, 'posts', 'author_id', 'authors\\(id\\)');

    expectColumn(sql, 'comments', 'id', 'serial\\s+primary\\s+key');
    expectColumn(sql, 'comments', 'post_id', 'integer\\s+not\\s+null');
    expectColumn(sql, 'comments', 'author_id', 'integer\\s+not\\s+null');
    expectColumn(sql, 'comments', 'body', 'text\\s+not\\s+null');
    expectColumn(sql, 'comments', 'created_at', 'timestamptz\\s+default\\s+now\\(\\)');
    expectForeignKey(sql, 'comments', 'post_id', 'posts\\(id\\)');
    expectForeignKey(sql, 'comments', 'author_id', 'authors\\(id\\)');
  });
});
