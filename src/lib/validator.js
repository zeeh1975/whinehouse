const validateTextField = (object, field) => {
  if (!object.hasOwnProperty(field)) {
    return `No hay un campo '${field}'`;
  }
  if (typeof object[field] !== "string") {
    return `El campo '${field}' debe ser texto`;
  }
  if (object[field].trim() == "") {
    return `El campo '${field}' no puede estar vacío`;
  }
  return "";
};

const validateNumericField = (object, field) => {
  if (!object.hasOwnProperty(field)) {
    return `No hay un campo '${field}'`;
  }
  if (isNaN(parseInt(object[field]))) {
    return `El campo '${field}' debe ser numerico`;
  }
  return "";
};

const complexPassword = (pw, minLength, upper, lower, number, special) => {
  var anUpperCase = /[A-Z]/;
  var aLowerCase = /[a-z]/;
  var aNumber = /[0-9]/;
  var aSpecial = /[!|@|#|$|%|^|&|*|(|)|-|_]/;

  if (pw.length < minLength) {
    return false;
  }

  var numUpper = 0;
  var numLower = 0;
  var numNums = 0;
  var numSpecials = 0;
  for (var i = 0; i < pw.length; i++) {
    if (anUpperCase.test(pw[i])) numUpper++;
    else if (aLowerCase.test(pw[i])) numLower++;
    else if (aNumber.test(pw[i])) numNums++;
    else if (aSpecial.test(pw[i])) numSpecials++;
  }
  if (upper && numUpper < 1) {
    return false;
  }
  if (lower && numLower < 1) {
    return false;
  }
  if (number && numNums < 1) {
    return false;
  }
  if (special && numSpecials < 1) {
    return false;
  }
  return true;
};

export { validateTextField, validateNumericField, complexPassword };
