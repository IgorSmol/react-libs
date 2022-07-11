import { useState } from 'react';

export default function useFormControl(initValue = '', options = {}) {
  const [_defValue, _setDefValue] = useState(initValue);
  const [value, _setValue] = useState(_defValue);
  const [error, _setError] = useState();
  const [isDirty, _setDirty] = useState(false);
  const [isDisabled, _setDisabled] = useState(options.disabled);
  const [hasError, _setHasError] = useState(false);
  const _validateOnChange = !!options.validateOnChange;
  const _validators = Array.isArray(options.validators) ? options.validators : [];
  const _limitations = Array.isArray(options.limitations) ? options.limitations : [];

  function setValue(prop) {
    if (isDisabled) {
      return;
    }
    let newValue;
    if (typeof prop === 'object' && 'target' in  prop) {
      newValue = _getTargetValue(prop.target);
    } else {
      newValue = prop;
    }
    const passLimitation = _runLimitation(newValue);
    if (!passLimitation) {
      return;
    }
    if (_validateOnChange) {
      _validation(newValue, true);
    } else {
      _setHasError(false);
      _setError(null);
    }
    _setValue(newValue);
    _setDirty(true);
  }

  function _getTargetValue(target) {
    switch (target.type) {
      case 'checkbox':
        return target.checked;
      case 'radio':
        return target.defaultValue;
      default:
        return target.value;
    }
  }

  function _runLimitation(controlValue) {
    let countOfSuccessfulLimits = 0;
    for (let index = 0; index < _limitations.length; index++) {
      const passLimitation = _limitations[index](controlValue);
      if (!passLimitation) {
        break;
      } else {
        countOfSuccessfulLimits++;
      }
    }
    return countOfSuccessfulLimits === _limitations.length;
  }

  function _validation(controlValue, isControlDirty) {
    if (_validators.length && isControlDirty) {
      let countOfSuccessfulValidators = 0;
      for (let index = 0; index < _validators.length; index++) {
        let fn;
        let msg;
        if (Array.isArray(_validators[index])) {
          fn = _validators[index][0];
          msg = _validators[index][1];
        } else {
          fn = _validators[index];
        }
        const isValid = fn(controlValue);
        if (!isValid) {
          _setError(msg || true);
          break;
        } else {
          countOfSuccessfulValidators++;
        }
      }
      if (countOfSuccessfulValidators === _validators.length) {
        _setError(false);
      }
      _setHasError(countOfSuccessfulValidators !== _validators.length);
    }
  }

  function runValidation() {
    _validation(value, isDirty);
  }

  function setError(msg) {
    _setHasError(true);
    _setError(msg);
  }

  function reset(valueProp, opt) {
    _setValue(typeof valueProp === 'boolean' ? valueProp : (valueProp || _defValue));
    _setDirty(false);
    _setError(false);
    _setHasError(false);
    if (valueProp || typeof valueProp === 'boolean') {
      _setDefValue(valueProp);
    }
    if (opt && opt.disabled) {
      _setDisabled(opt.disabled);
    }
  }

  return {
    value,
    error,
    isDirty,
    isDisabled,
    hasError,
    setValue,
    reset,
    runValidation,
    setError,
  };
}
