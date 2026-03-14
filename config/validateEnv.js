const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
];

function validateEnv(env = process.env) {
  const missing = requiredEnvVars.filter((name) => !env[name]);
  if (missing.length) {
    const message = `Faltan variables de entorno: ${missing.join(', ')}`;
    const err = new Error(message);
    err.code = 'ENV_MISSING';
    throw err;
  }
  return true;
}

module.exports = {
  validateEnv,
  requiredEnvVars,
};
