import { describe, test, expect } from 'vitest';
import validators from '../src/validators.js';
const { validarEmail, validarEdad } = validators;

describe('validarEmail', () => {
  test('acepta email valido', () => {
    expect(validarEmail('test@example.com')).toBe(null);
  });
  test('rechaza email sin @', () => {
    expect(validarEmail('testexample.com')).toContain('invalido');
  });
  test('rechaza email sin dominio', () => {
    expect(validarEmail('test@')).toContain('invalido');
  });
  test('rechaza email vacio', () => {
    expect(validarEmail('')).toContain('requerido');
  });
  test('rechaza email null', () => {
    expect(validarEmail(null)).toContain('requerido');
  });
});

describe('validarEdad', () => {
  test('acepta edad valida', () => {
    expect(validarEdad(25)).toBe(null);
  });
  test('acepta edad undefined (campo opcional)', () => {
    expect(validarEdad(undefined)).toBe(null);
  });
  test('rechaza edad negativa', () => {
    expect(validarEdad(-5)).toContain('entre 0 y 150');
  });
  test('rechaza edad mayor a 150', () => {
    expect(validarEdad(200)).toContain('entre 0 y 150');
  });
  test('rechaza edad que no es numero', () => {
    expect(validarEdad('25')).toContain('debe ser un numero');
  });
  test('rechaza NaN', () => {
    expect(validarEdad(Number.NaN)).toContain('debe ser un numero');
  });
});