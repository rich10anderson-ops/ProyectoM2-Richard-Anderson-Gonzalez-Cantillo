const express = require('express');
const { validarIdPositivo, validarString } = require('../src/validators');
const { badRequest, notFound } = require('../src/errors');
const postsService = require('../src/services/posts');

const router = express.Router();

function parseId(value, campo = 'id') {
  const err = validarIdPositivo(value, campo);
  if (err) throw badRequest(err);
  return Number(value);
}

function parseBooleanOptional(value, campo = 'published') {
  if (value === undefined) return undefined;
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  if (value === false || value === 'false' || value === 0 || value === '0') return false;
  throw badRequest(`${campo} debe ser booleano`);
}

router.get('/', async (req, res, next) => {
  try {
    const published = parseBooleanOptional(req.query.published, 'published');
    const posts = await postsService.list({ published });
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get('/author/:authorId', async (req, res, next) => {
  try {
    const authorId = parseId(req.params.authorId, 'author_id');
    const posts = await postsService.listByAuthor(authorId);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const post = await postsService.findById(id);
    if (!post) throw notFound('Post no encontrado');
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, content, author_id } = req.body;
    const published = parseBooleanOptional(req.body.published, 'published') ?? false;

    const titleErr = validarString(title, 'title', { maxLength: 200 });
    if (titleErr) throw badRequest(titleErr);

    const contentErr = validarString(content, 'content', { maxLength: 5000 });
    if (contentErr) throw badRequest(contentErr);

    const authorIdErr = validarIdPositivo(author_id, 'author_id');
    if (authorIdErr) throw badRequest(authorIdErr);

    const created = await postsService.create({
      title: title.trim(),
      content: content.trim(),
      author_id: Number(author_id),
      published,
    });
    res.status(201).json(created);
  } catch (err) {
    if (err.code === '23503') {
      err.status = 400;
      err.message = 'author_id no existe';
    }
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const { title, content, author_id } = req.body;
    const published = parseBooleanOptional(req.body.published, 'published');

    if (title === undefined && content === undefined && published === undefined && author_id === undefined) {
      throw badRequest('No hay campos para actualizar');
    }

    if (title !== undefined) {
      const err = validarString(title, 'title', { maxLength: 200 });
      if (err) throw badRequest(err);
    }
    if (content !== undefined) {
      const err = validarString(content, 'content', { maxLength: 5000 });
      if (err) throw badRequest(err);
    }
    if (author_id !== undefined) {
      const err = validarIdPositivo(author_id, 'author_id');
      if (err) throw badRequest(err);
    }

    const updated = await postsService.update(id, {
      title: title?.trim(),
      content: content?.trim(),
      published,
      author_id: author_id !== undefined ? Number(author_id) : undefined,
    });
    if (!updated) throw notFound('Post no encontrado');
    res.json(updated);
  } catch (err) {
    if (err.code === '23503') {
      err.status = 400;
      err.message = 'author_id no existe';
    }
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    const deleted = await postsService.remove(id);
    if (!deleted) throw notFound('Post no encontrado');
    res.json({ message: 'Post eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
