function createHttpError(status, message, pgCode) {
  const err = new Error(message);
  err.status = status;
  if (pgCode) err.code = pgCode;
  return err;
}

function badRequest(message) {
  return createHttpError(400, message);
}

function notFound(message) {
  return createHttpError(404, message);
}

function conflict(message) {
  return createHttpError(409, message);
}

module.exports = {
  createHttpError,
  badRequest,
  notFound,
  conflict,
};

