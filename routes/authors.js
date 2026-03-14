const express = require('express');
const pool = require('../db/config');
const { validarEmail } = require('../src/validators');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM authors ORDER BY id');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM authors WHERE id = $1', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;
    if (!name) return res.status(400).json({ error: 'El nombre es requerido' });
    const emailError = validarEmail(email);
    if (emailError) return res.status(400).json({ error: emailError });

    const { rows } = await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
      [name, email, bio || null],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El email ya existe' });
    }
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, bio } = req.body;
    if (name === undefined && email === undefined && bio === undefined) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }
    if (email !== undefined) {
      const emailError = validarEmail(email);
      if (emailError) return res.status(400).json({ error: emailError });
    }

    const fields = [];
    const values = [];
    let idx = 1;
    if (name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(name);
    }
    if (email !== undefined) {
      fields.push(`email = $${idx++}`);
      values.push(email);
    }
    if (bio !== undefined) {
      fields.push(`bio = $${idx++}`);
      values.push(bio);
    }
    values.push(req.params.id);

    const query = `UPDATE authors SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const { rows } = await pool.query(query, values);
    if (!rows.length) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El email ya existe' });
    }
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('DELETE FROM authors WHERE id = $1 RETURNING *', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json({ message: 'Autor eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
