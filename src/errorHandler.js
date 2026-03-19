function mapPgError(err) {
  switch (err.code) {
    case '22P02':
      return { status: 400, message: 'El id debe ser un entero' };
    case '23503':
      return { status: 409, message: 'Violacion de integridad referencial (FK)' };
    case '23505':
      return { status: 409, message: 'Dato duplicado' };
    case '42P01':
      return { status: 500, message: 'Base de datos no inicializada. Ejecuta npm run db:setup' };
    case 'ECONNREFUSED':
      return { status: 500, message: 'No se pudo conectar a PostgreSQL. Revisa variables de entorno y servicio' };
    default:
      return null;
  }
}

function errorHandler(err, req, res, next) {
  const mapped = mapPgError(err);
  const status = err.status || err.statusCode || mapped?.status || 500;
  const message = err.message || mapped?.message || 'Error interno del servidor';

  const body = { error: message };
  if (mapped?.status === 409 || err.status === 409) {
    body.code = 'CONFLICT';
  }
  if (process.env.NODE_ENV !== 'production' && err.code) {
    body.pg_code = err.code;
  }

  res.status(status).json(body);
}

module.exports = { errorHandler };
