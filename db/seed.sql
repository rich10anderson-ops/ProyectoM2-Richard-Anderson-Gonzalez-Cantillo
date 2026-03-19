INSERT INTO authors (name, email, bio) VALUES
  ('Richard Gonzalez', 'rixar@example.com', 'Fan del America de Cali-enamorado del desarrollo pupilo de Node.js'),
  ('Carlos Ruiz', 'carlos@example.com', 'Escritor tecnico y DBA'),
  ('Maria Lopez', 'maria@example.com', 'Ingeniera de software en APIs REST');

INSERT INTO posts (title, content, author_id, published) VALUES
  ('Introduccion a Node.js', 'Node.js es un runtime de JavaScript...', 1, true),
  ('PostgreSQL vs MySQL', 'Ambas bases de datos tienen ventajas...', 2, true),
  ('APIs RESTful', 'REST es un estilo arquitectonico...', 1, true),
  ('Manejo de errores en Express', 'El manejo apropiado de errores...', 3, false),
  ('Async/Await explicado', 'Las promesas simplifican el codigo asincrono...', 1, false);

INSERT INTO comments (post_id, author_id, body) VALUES
  (1, 2, 'Muy buen resumen, agrega ejemplos de fs/promises'),
  (1, 3, 'Me gusto la parte de eventos'),
  (2, 1, 'Falta mencionar replicacion'),
  (3, 2, 'REST y GraphQL juntos? interesante');
