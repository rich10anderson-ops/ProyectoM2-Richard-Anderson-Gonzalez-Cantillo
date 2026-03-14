const express = require('express');
const pool = require('../db/config');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM comments ORDER BY id');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM comments WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Comentario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { post_id, author_id, body } = req.body;
    if (!post_id || !author_id || !body) {
      return res.status(400).json({ error: 'post_id, author_id y body son requeridos' });
    }
    const { rows } = await pool.query(
      'INSERT INTO comments (post_id, author_id, body) VALUES ($1, $2, $3) RETURNING *',
      [post_id, author_id, body],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ error: 'post_id o author_id no existen' });
    }
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { body } = req.body;
    if (body === undefined) return res.status(400).json({ error: 'body es requerido' });
    const { rows } = await pool.query(
      'UPDATE comments SET body = $1 WHERE id = $2 RETURNING *',
      [body, req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Comentario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING *', [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ error: 'Comentario no encontrado' });
    res.json({ message: 'Comentario eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
