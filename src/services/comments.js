const pool = require('../../db/config');

async function list() {
  const { rows } = await pool.query('SELECT * FROM comments ORDER BY id');
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create({ post_id, author_id, body }) {
  const { rows } = await pool.query(
    'INSERT INTO comments (post_id, author_id, body) VALUES ($1, $2, $3) RETURNING *',
    [post_id, author_id, body],
  );
  return rows[0];
}

async function update(id, fields) {
  const { rows } = await pool.query('UPDATE comments SET body = $1 WHERE id = $2 RETURNING *', [
    fields.body,
    id,
  ]);
  return rows[0] || null;
}

async function remove(id) {
  const { rows } = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING *', [id]);
  return rows[0] || null;
}

module.exports = { list, findById, create, update, remove };
