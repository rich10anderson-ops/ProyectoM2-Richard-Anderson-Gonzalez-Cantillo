import request from 'supertest';
import { beforeEach, afterEach, describe, test, expect, vi } from 'vitest';
import { createTestPool } from './test-db.js';

let app;
let pool;

beforeEach(async () => {
  vi.resetModules();
  const { pool: testPool } = createTestPool();
  pool = testPool;
  global.__TEST_POOL__ = pool;
  const mod = await import('../server.js');
  app = mod.default || mod;
});

afterEach(async () => {
  await pool?.end();
  delete global.__TEST_POOL__;
});

describe('Authors API', () => {
  test('GET /api/authors devuelve los seed', async () => {
    const res = await request(app).get('/api/authors');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body[0]).toHaveProperty('email');
  });

  test('POST /api/authors valida email duplicado', async () => {
    const res = await request(app).post('/api/authors').send({
      name: 'Nuevo',
      email: 'rixar@example.com',
      bio: 'dup',
    });
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/ya existe/i);
  });
});

describe('Posts API', () => {
  test('GET /api/posts?published=true filtra publicados', async () => {
    const res = await request(app).get('/api/posts?published=true');
    expect(res.status).toBe(200);
    expect(res.body.every((p) => p.published)).toBe(true);
  });

  test('POST /api/posts requiere campos', async () => {
    const res = await request(app).post('/api/posts').send({ title: 'x' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/content/i);
  });
});

describe('Comments API', () => {
  test('POST /api/comments requiere campos', async () => {
    const res = await request(app).post('/api/comments').send({ body: 'hola' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/post_id/);
  });

  test('PUT /api/comments/:id valida id numerico', async () => {
    const res = await request(app).put('/api/comments/abc').send({ body: 'edit' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/entero/);
  });
});
