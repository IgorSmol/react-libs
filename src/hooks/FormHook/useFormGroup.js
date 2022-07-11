import { useState } from 'react';

export default function useFormGroup(controls = {}, options, validatorOption) {
  const [
    _initValues,
    _initValidators,
    _initLimitations,
  ] = initValues();
  const [_defValues, _setDefValues] = useState(_initValues);
  const [_defValidators, _setDefValidators] = useState(_initValidators);
  const [_defLimitations, _setDefLimitations] = useState(_initLimitations);
  const [values, _setValue] = useState(_defValues);
  const [isValid, _setValidStatus] = useState(true);
  const [isDirty, _setDirty] = useState(false);
  const [hasError, _setHasError] = useState(false);
  const [error, _setError] = useState(false);
  const [errors, _setErrors] = useState({});

  function initValues() {
    const {
      initValues,
      validators,
      limitations
    } = Object.entries(controls).reduce((acc, [field, props]) => {
      if (typeof props === 'object') {
        return {
          ...acc,
          initValues: { ...acc.initValues, [field]: props.value || '' },
          validators: { ...acc.validators, [field]: Array.isArray(props.validators) ? props.validators : [] },
          limitations: {...acc.limitations, [field]: Array.isArray(props.limitations) ? props.limitations : [] },
        };
      } else if (typeof props === 'string') {
        return {
          ...acc,
          initValues: { ...acc.initValues, [field]: props },
        };
      }
      return acc;
    }, {});

    return [initValues, validators, limitations];
  }

  function setValue(prop) {
    if (prop === null || prop === undefined) {
      console.error('Form Group: Can\'t set \'null\' or \'undefined\'');
      return;
    }
    if (
      prop === '' || (
        typeof prop === 'object' && !('target' in prop || 'name' in prop)
      )
    ) {
      console.error('Form Group: Invalid parameter. Provide \'target Event object\' or object with \'name\' and \'value\' parameters');
      return;
    }
    if ('target' in prop && prop.target.name === '') {
      console.error('Form Group: Provide \'name\' attribute to form field element');
      return;
    }
    const controlName = 'target' in prop ? prop.target.name : prop.name;
    let controlValue = 'target' in prop ? _getTargetValue(prop.target) : prop.value;
    _setValueHandler(controlName, controlValue);
  }

  function _setValueHandler(controlName, controlValue) {
    if (controlName in values) {
      const passLimitation = _runLimitation(controlName, controlValue);
      if (!passLimitation) {
        return;
      }
      if (options && options.onChangeValidation) {
        _validation(controlName, controlValue, true);
      } else {
        if (Object.keys(errors).length === 1) {
          _setHasError(false);
        }
        _setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors[controlName];
          return updatedErrors;
        });
      }
      if (!isDirty) {
        _setDirty(true);
      }
      _setValue((prevState) => ({
        ...prevState,
        [controlName]: controlValue,
      }));
    }
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

  function runValidation(prop) {
    if (prop === null || prop === undefined) {
      console.error('Form Group: Can\'t set \'null\' or \'undefined\'');
      return;
    }
    if (
      prop === '' || (
        typeof prop === 'object' && !('target' in prop || 'name' in prop)
      )
    ) {
      console.error('Form Group: Invalid parameter. Provide \'target Event object\' or object with \'name\' and \'value\' parameters');
      return;
    }
    if ('target' in prop && prop.target.name === '') {
      console.error('Form Group: Provide \'name\' attribute to form field element');
      return;
    }
    const controlName = 'target' in prop ? prop.target.name : prop.name;
    let controlValue = 'target' in prop ? _getTargetValue(prop.target) : prop.value;
    _validation(controlName, controlValue, true);
  }

  function _runLimitation(controlName, controlValue) {
    if (!_defLimitations[controlName]) {
      return true;
    }
    let countOfSuccessfulLimits = 0;
    for (let index = 0; index < _defLimitations[controlName].length; index++) {
      const passLimitation = _defLimitations[controlName][index](controlValue);
      if (!passLimitation) {
        break;
      } else {
        countOfSuccessfulLimits++;
      }
    }
    return countOfSuccessfulLimits === _defLimitations[controlName].length;
  }

  function _validation(controlName, controlValue, isControlDirty) {
    if (_defValidators[controlName]?.length && isControlDirty) {
      let countOfSuccessfulValidators = 0;
      for (let index = 0; index < _defValidators[controlName].length; index++) {
        let fn;
        let msg;
        if (Array.isArray(_defValidators[controlName][index])) {
          fn = _defValidators[controlName][index][0];
          msg = _defValidators[controlName][index][1];
        } else {
          fn = _defValidators[controlName][index];
        }
        const isValid = fn(controlValue);
        if (!isValid) {
          _setErrors((prevErrors) => ({ ...prevErrors, [controlName]: msg || true }));
          if (Object.keys(errors).length === 0) {
            _setHasError(true);
            _setValidStatus(false);
          }
          break;
        } else {
          countOfSuccessfulValidators++;
        }
      }
      if (countOfSuccessfulValidators === _defValidators[controlName].length) {
        let errorsLength = 0;
        _setErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors[controlName];
          errorsLength = Object.keys(updatedErrors).length;
          return updatedErrors;
        });
        if (errorsLength === 0) {
          _setHasError(false);
          _setValidStatus(true);
        }
      }
      return countOfSuccessfulValidators === _defValidators[controlName].length;
    }
    return true;
  }

  function getRawValues(noEmptyValues = false) {
    return _result(noEmptyValues);
  }

  function getValuesAndStatus(noEmptyValues = false) {
    return _result(noEmptyValues, true);
  }

  function _result(noEmptyValues, withStatus) {
    let groupData = {};
    let groupValid = isValid;

    Object.entries(values).forEach(([controlName, controlValue]) => {
      const validControl = _validation(controlName, controlValue, true);
      if (!validControl) {
        groupValid = false;
      }
      if (!noEmptyValues || (noEmptyValues && controlValue !== '' && controlValue !== null && controlValue !== undefined)) {
        groupData[controlName] = controlValue;
      }
    });

    let groupError = groupValid ? false : 'Validation error';

    if (groupValid && typeof validatorOption === 'function') {
      groupValid = validatorOption(groupData);
      groupError = !groupValid;
    }
    if (groupValid && typeof validatorOption === 'object' && 'validator' in  validatorOption) {
      groupValid = validatorOption.validator(groupData);
      groupError = groupValid ? false : (validatorOption.errorMsg || true);
    }
    if (!groupValid) {
      groupData = null;
    }

    _setValidStatus(groupValid);
    _setHasError(!groupValid);
    _setError(groupError);

    return withStatus ? {
      data: groupData,
      isValid: groupValid,
      error: groupError,
    } : groupData;
  }

  function reset(newDefValues) {
    if (typeof newDefValues === 'object') {
      _setDefValues({ ..._defValues, ...newDefValues });
      _setValue({ ..._defValues, ...newDefValues });
    } else {
      _setValue(_defValues);
    }
  }

  function registerControl(newControl = {}) {
    const { name, value, limitations, validators } = newControl;
    if (!name || values[name]) {
      return;
    }
    _setDefValues((prevState) => ({
      ...prevState,
      [name]: value || '',
    }));
    _setValue((prevState) => ({
      ...prevState,
      [name]: value || '',
    }));
    if (limitations && limitations.length) {
      _setDefLimitations((prevState) => ({
        ...prevState,
        [name]: [...limitations],
      }));
    }
    if (validators && validators.length) {
      _setDefValidators((prevState) => ({
        ...prevState,
        [name]: [...validators],
      }));
    }
  }

  function unregisterControl(controlName) {
    if (!controlName) {
      console.error('Form Group: Invalid control name');
      return;
    }
    _setValue((prevState) => {
      const newState = { ...prevState }
      delete newState[controlName];
      return newState;
    });
  }

  return {
    values,
    setValue,
    runValidation,
    isValid,
    isDirty,
    hasError,
    error,
    errors,
    getRawValues,
    getValuesAndStatus,
    reset,
    registerControl,
    unregisterControl,
  };
}
