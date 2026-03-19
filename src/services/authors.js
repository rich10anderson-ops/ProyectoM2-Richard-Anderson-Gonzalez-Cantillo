const pool = require('../../db/config');

async function list() {
  const { rows } = await pool.query('SELECT * FROM authors ORDER BY id');
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create({ name, email, bio }) {
  const { rows } = await pool.query(
    'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
    [name, email, bio || null],
  );
  return rows[0];
}

async function update(id, fields) {
  const sets = [];
  const values = [];
  let idx = 1;

  if (fields.name !== undefined) {
    sets.push(`name = $${idx++}`);
    values.push(fields.name);
  }
  if (fields.email !== undefined) {
    sets.push(`email = $${idx++}`);
    values.push(fields.email);
  }
  if (fields.bio !== undefined) {
    sets.push(`bio = $${idx++}`);
    values.push(fields.bio);
  }

  values.push(id);

  const query = `UPDATE authors SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`;
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}

async function remove(id) {
  const { rows } = await pool.query('DELETE FROM authors WHERE id = $1 RETURNING *', [id]);
  return rows[0] || null;
}

module.exports = { list, findById, create, update, remove };
