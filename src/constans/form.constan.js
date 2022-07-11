import Validators from '../utils/validators.util';

export const nameFieldValidations = [
  [Validators.required, 'This required'],
  [Validators.pattern(/^[A-Za-z]+$/), 'Not valid'],
]