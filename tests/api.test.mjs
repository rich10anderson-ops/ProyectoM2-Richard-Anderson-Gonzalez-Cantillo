import request from 'supertest';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import pool from '../db/config.js';

// mock pg pool before loading app/routes
pool.query = vi.fn();

import app from '../server.js';

beforeEach(() => {
  pool.query.mockReset();
});

describe('Authors API', () => {
  test.skip('GET /api/authors devuelve lista', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Ana' }] });

    const res = await request(app).get('/api/authors');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: 'Ana' }]);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM authors ORDER BY id');
  });
});

describe('Posts API', () => {
  test.skip('GET /api/posts?published=true filtra publicados', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 7, published: true }] });

    const res = await request(app).get('/api/posts?published=true');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 7, published: true }]);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM posts WHERE published =  ORDER BY id',
      [true],
    );
  });
});

describe('Comments API', () => {
  test.skip('POST /api/comments requiere post_id, author_id, body', async () => {
    const res = await request(app).post('/api/comments').send({ body: 'hola' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/post_id/);
    expect(pool.query).not.toHaveBeenCalled();
  });
});
