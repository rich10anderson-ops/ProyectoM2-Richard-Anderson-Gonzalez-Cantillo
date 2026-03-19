const pool = require('../../db/config');

async function list({ published } = {}) {
  let query = 'SELECT * FROM posts';
  const values = [];
  if (published !== undefined) {
    values.push(published);
    query += ' WHERE published = $1';
  }
  query += ' ORDER BY id';
  const { rows } = await pool.query(query, values);
  return rows;
}

async function listByAuthor(authorId) {
  const { rows } = await pool.query('SELECT * FROM posts WHERE author_id = $1 ORDER BY id', [authorId]);
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create({ title, content, author_id, published = false }) {
  const { rows } = await pool.query(
    'INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, content, author_id, Boolean(published)],
  );
  return rows[0];
}

async function update(id, fields) {
  const sets = [];
  const values = [];
  let idx = 1;

  if (fields.title !== undefined) {
    sets.push(`title = $${idx++}`);
    values.push(fields.title);
  }
  if (fields.content !== undefined) {
    sets.push(`content = $${idx++}`);
    values.push(fields.content);
  }
  if (fields.published !== undefined) {
    sets.push(`published = $${idx++}`);
    values.push(Boolean(fields.published));
  }
  if (fields.author_id !== undefined) {
    sets.push(`author_id = $${idx++}`);
    values.push(fields.author_id);
  }

  values.push(id);

  const query = `UPDATE posts SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`;
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}

async function remove(id) {
  const { rows } = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
  return rows[0] || null;
}

module.exports = { list, listByAuthor, findById, create, update, remove };
