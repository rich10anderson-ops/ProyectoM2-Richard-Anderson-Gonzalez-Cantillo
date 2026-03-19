const express = require('express');
const { validarIdPositivo, validarString } = require('../src/validators');
const { badRequest, notFound } = require('../src/errors');
const commentsService = require('../src/services/comments');

const router = express.Router();

function parseId(value, campo = 'id') {
  const err = validarIdPositivo(value, campo);
  if (err) throw badRequest(err);
  return Number(value);
}

router.get('/', async (req, res, next) => {
  try {
    const comments = await commentsService.list();
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const comment = await commentsService.findById(id);
    if (!comment) throw notFound('Comentario no encontrado');
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { post_id, author_id, body } = req.body;

    const postErr = validarIdPositivo(post_id, 'post_id');
    if (postErr) throw badRequest(postErr);
    const authorErr = validarIdPositivo(author_id, 'author_id');
    if (authorErr) throw badRequest(authorErr);
    const bodyErr = validarString(body, 'body', { maxLength: 1000 });
    if (bodyErr) throw badRequest(bodyErr);

    const created = await commentsService.create({
      post_id: Number(post_id),
      author_id: Number(author_id),
      body: body.trim(),
    });
    res.status(201).json(created);
  } catch (err) {
    if (err.code === '23503') {
      err.status = 400;
      err.message = 'post_id o author_id no existen';
    }
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const { body } = req.body;
    const bodyErr = validarString(body, 'body', { maxLength: 1000 });
    if (bodyErr) throw badRequest(bodyErr);

    const updated = await commentsService.update(id, { body: body.trim() });
    if (!updated) throw notFound('Comentario no encontrado');
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const deleted = await commentsService.remove(id);
    if (!deleted) throw notFound('Comentario no encontrado');
    res.json({ message: 'Comentario eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
