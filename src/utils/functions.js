export const imageToBlob = async uri => {
  // convierte una imagen desde una uri a un blob para que se pueda subir a firebase storage

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function() {
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  return blob;
};

//Funcion para eliminar espacios vacios antes y despues de un string.
//@param: strings -> es un array de strings
//Valida que el parametro sea un array y devuelve un array de los valores trimeados.
//Si llega a no ser un array de strings. Devuelve un array vacio
export const trimStrings = strings => {
  try {
    return strings.map(string => string.trim());
  } catch (err) {
    return [];
  }
};

export const validateValueType = (type, value) => {
  switch (type) {
    case 'int':
      return Number.isInteger(parseInt(value)) && parseInt(value) > 0;
    case 'number':
      return !isNaN(parseFloat(value)) && !isNaN(value - 0);
    case 'string':
      return value.length > 0 && value.trim();
    case 'email':
      const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRe.test(String(value).toLowerCase());
    case 'password':
      //alfanumerica y minimo 6 caracteres
      const passRe = /^(?=.*\d)[0-9a-zA-Z]{6,}$/;
      return passRe.test(String(value));
    case 'cuit':
      const cuitRe = /^[0-9]{10,11}$/;
      return cuitRe.test(String(value));
    case 'name':
      const nameRe = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\-,.'"´`]+$/;
      return nameRe.test(String(value));
    case 'phone':
      const phoneRe = /^[+]{0,1}[(]{0,1}[0-9]*[)]{0,1}[-\s0-9]+$/;
      return phoneRe.test(String(value));
    default:
      return null;
  }
};
