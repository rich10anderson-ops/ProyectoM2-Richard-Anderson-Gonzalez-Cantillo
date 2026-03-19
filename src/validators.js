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
  validarIdPositivo,
  validarString,
  validarBooleano,
};

function validarIdPositivo(valor, campo = 'id') {
  const num = Number(valor);
  if (!Number.isInteger(num) || num <= 0) {
    return `${campo} debe ser un entero positivo`;
  }
  return null;
}

function validarString(valor, campo, { requerido = true, maxLength = 255, trim = true } = {}) {
  if (valor === undefined || valor === null) {
    return requerido ? `${campo} es requerido` : null;
  }
  const str = trim ? String(valor).trim() : String(valor);
  if (requerido && str.length === 0) {
    return `${campo} no puede estar vacio`;
  }
  if (str.length > maxLength) {
    return `${campo} debe tener maximo ${maxLength} caracteres`;
  }
  return null;
}

function validarBooleano(valor, campo) {
  if (valor === undefined || valor === null) return null; // opcional
  if (typeof valor === 'boolean') return null;
  return `${campo} debe ser booleano`;
}
