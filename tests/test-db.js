import fs from 'fs';
import path from 'path';
import { newDb } from 'pg-mem';

export function createTestPool() {
  const db = newDb({ autoCreateForeignKeyIndices: true });
  const setupSql = fs.readFileSync(path.join(__dirname, '..', 'db', 'setup.sql'), 'utf8');
  const seedSql = fs.readFileSync(path.join(__dirname, '..', 'db', 'seed.sql'), 'utf8');
  db.public.none(setupSql);
  db.public.none(seedSql);

  const { Pool } = db.adapters.createPg();
  const pool = new Pool();
  const reset = () => {
    db.public.none('TRUNCATE comments RESTART IDENTITY CASCADE;');
    db.public.none('TRUNCATE posts RESTART IDENTITY CASCADE;');
    db.public.none('TRUNCATE authors RESTART IDENTITY CASCADE;');
    db.public.none(seedSql);
  };
  return { db, pool, reset };
}
