function validarEmail(email) {
  if (!email) {
    return 'El email es requerido';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'El formato del email es invalido';
  }
  return null;
}

function validarEdad(edad) {
  if (edad === undefined) return null;

  if (typeof edad !== 'number' || Number.isNaN(edad)) {
    return 'La edad debe ser un numero';
  }

  if (edad < 0 || edad > 150) {
    return 'La edad debe estar entre 0 y 150';
  }

  return null;
}

module.exports = {
  validarEmail,
  validarEdad,
};
