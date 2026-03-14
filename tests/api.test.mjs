import request from 'supertest';
import { describe, test, expect } from 'vitest';
import app from '../server.js';

describe('Authors API', () => {
  test('GET /api/authors devuelve lista', async () => {
    const res = await request(app).get('/api/authors');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
  });
});

describe('Posts API', () => {
  test('GET /api/posts?published=true filtra publicados', async () => {
    const res = await request(app).get('/api/posts?published=true');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.every((p) => p.published === true)).toBe(true);
  });
});

describe('Comments API', () => {
  test('POST /api/comments requiere post_id, author_id, body', async () => {
    const res = await request(app).post('/api/comments').send({ body: 'hola' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/post_id/);
  });
});
