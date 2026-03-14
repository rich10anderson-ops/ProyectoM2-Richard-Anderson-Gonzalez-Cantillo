export function errorHandler(err, req, res, next) {
  // Determinar el código de estado
  const statusCode = err.status || err.statusCode || 500;
  
  // Determinar el mensaje
  const message = err.message || 'Error interno del servidor';

  // Responder con formato consistente
  res.status(statusCode).json({
    error: message,
    status: statusCode
  });
}