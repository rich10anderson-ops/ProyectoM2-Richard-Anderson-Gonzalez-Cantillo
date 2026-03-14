const express = require('express');
const pool = require('../db/config');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { published } = req.query;
    let query = 'SELECT * FROM posts';
    const values = [];
    if (published !== undefined) {
      values.push(published === 'true');
      query += ' WHERE published = $1';
    }
    query += ' ORDER BY id';
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/author/:authorId', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts WHERE author_id = $1 ORDER BY id', [
      req.params.authorId,
    ]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, content, author_id, published } = req.body;
    if (!title || !content || !author_id) {
      return res.status(400).json({ error: 'title, content y author_id son requeridos' });
    }

    const { rows } = await pool.query(
      'INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, COALESCE($4, false)) RETURNING *',
      [title, content, author_id, published],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ error: 'author_id no existe' });
    }
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { title, content, published, author_id } = req.body;
    if (title === undefined && content === undefined && published === undefined && author_id === undefined) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    const fields = [];
    const values = [];
    let idx = 1;
    if (title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(title);
    }
    if (content !== undefined) {
      fields.push(`content = $${idx++}`);
      values.push(content);
    }
    if (published !== undefined) {
      fields.push(`published = $${idx++}`);
      values.push(published);
    }
    if (author_id !== undefined) {
      fields.push(`author_id = $${idx++}`);
      values.push(author_id);
    }
    values.push(req.params.id);

    const query = `UPDATE posts SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const { rows } = await pool.query(query, values);
    if (!rows.length) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ error: 'author_id no existe' });
    }
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json({ message: 'Post eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
