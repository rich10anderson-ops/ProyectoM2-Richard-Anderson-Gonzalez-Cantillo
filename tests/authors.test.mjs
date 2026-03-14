import request from 'supertest';
import { describe, test, expect } from 'vitest';
import app from '../server.js';
import validators from '../src/validators.js';

const { validarEmail } = validators;

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

describe('Validacion de autores', () => {
  test('debe validar email correctamente', () => {
    expect(validarEmail('test@example.com')).toBe(null);
  });

  test('debe rechazar email sin @', () => {
    const resultado = validarEmail('testexample.com');
    expect(resultado).not.toBe(null);
    expect(resultado).toContain('invalido');
  });
});
