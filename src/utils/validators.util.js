function min(minNumberValue) {
  return (numberValue) => {
    return parseFloat(numberValue, 10) >= minNumberValue;
  };
}

function max(maxNumberValue) {
  return (numberValue) => {
    return parseFloat(numberValue, 10) <= maxNumberValue;
  };
}

function minLength(minStringLengthValue) {
  return (strValue) => {
    return strValue.length >= minStringLengthValue;
  };
}

function maxLength(maxStringLengthValue) {
  return (strValue) => {
    return strValue.length <= maxStringLengthValue;
  };
}

function required(value) {
  return value !== undefined && value !== null && value.trim() !== '';
}

function requiredTrue(value) {
  return value === true;
}

function pattern(regExp) {
  return (strValue) => {
    return regExp.test(strValue);
  };

}

const Validators = {
  min,
  max,
  minLength,
  maxLength,
  required,
  requiredTrue,
  pattern,
};

export default Validators;
