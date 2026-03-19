const express = require('express');
const { validarEmail, validarString, validarIdPositivo } = require('../src/validators');
const { badRequest, notFound } = require('../src/errors');
const authorsService = require('../src/services/authors');

const router = express.Router();

function parseId(param) {
  const err = validarIdPositivo(param, 'id');
  if (err) throw badRequest(err);
  return Number(param);
}

router.get('/', async (req, res, next) => {
  try {
    const authors = await authorsService.list();
    res.json(authors);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const author = await authorsService.findById(id);
    if (!author) throw notFound('Autor no encontrado');
    res.json(author);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;

    const nameErr = validarString(name, 'name', { maxLength: 100 });
    if (nameErr) throw badRequest(nameErr);

    const emailErr = validarEmail(email);
    if (emailErr) throw badRequest(emailErr);

    const bioErr = validarString(bio, 'bio', { requerido: false, maxLength: 500 });
    if (bioErr) throw badRequest(bioErr);

    const created = await authorsService.create({ name: name.trim(), email: email.trim(), bio });
    res.status(201).json(created);
  } catch (err) {
    if (err.code === '23505') {
      err.status = 409;
      err.message = 'El email ya existe';
    }
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const { name, email, bio } = req.body;

    if (name === undefined && email === undefined && bio === undefined) {
      throw badRequest('No hay campos para actualizar');
    }
    if (email !== undefined) {
      const emailErr = validarEmail(email);
      if (emailErr) throw badRequest(emailErr);
    }
    if (name !== undefined) {
      const nameErr = validarString(name, 'name', { maxLength: 100 });
      if (nameErr) throw badRequest(nameErr);
    }
    if (bio !== undefined) {
      const bioErr = validarString(bio, 'bio', { requerido: false, maxLength: 500 });
      if (bioErr) throw badRequest(bioErr);
    }

    const updated = await authorsService.update(id, {
      name: name?.trim(),
      email: email?.trim(),
      bio,
    });
    if (!updated) throw notFound('Autor no encontrado');
    res.json(updated);
  } catch (err) {
    if (err.code === '23505') {
      err.status = 409;
      err.message = 'El email ya existe';
    }
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const deleted = await authorsService.remove(id);
    if (!deleted) throw notFound('Autor no encontrado');
    res.json({ message: 'Autor eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
