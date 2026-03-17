import request from 'supertest';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import validators from '../src/validators.js';
import pool from '../db/config.js';

pool.query = vi.fn();

import app from '../server.js';

beforeEach(() => {
  pool.query.mockReset();
});

const { validarEmail } = validators;

describe('Authors API', () => {
  test.skip('GET /api/authors devuelve lista', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Ana' }] });

    const res = await request(app).get('/api/authors');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: 'Ana' }]);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM authors ORDER BY id');
  });
});

describe('Validacion de autores', () => {
  test.skip('debe validar email correctamente', () => {
    expect(validarEmail('test@example.com')).toBe(null);
  });

  test.skip('debe rechazar email sin @', () => {
    const resultado = validarEmail('testexample.com');
    expect(resultado).not.toBe(null);
    expect(resultado).toContain('invalido');
  });
});
