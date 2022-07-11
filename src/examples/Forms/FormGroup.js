import { useState } from 'react';
import useFormGroup from '../../hooks/FormHook/useFormGroup';
import classNames from '../../libs/classNames';
import Validators from '../../utils/validators.util';
import { nameFieldValidations } from '../../constans/form.constan';

function FormGroup() {
  const formGroup = useFormGroup({
    firstName: {
      value: 'Igor',
      limitations: [Validators.maxLength(10)],
      validators: nameFieldValidations,
    },
    lastName: {
      value: 'Smolskyy',
      limitations: [Validators.maxLength(10)],
      validators: nameFieldValidations,
    },
    password: { validators: [Validators.required, Validators.minLength(6)] },
    passwordConfirm: { validators: [Validators.required, Validators.minLength(6)] },
    jobTitle: 'customer',
    sex: { validators: [Validators.required] },
    notes: { limitations: [Validators.maxLength(10)] },
    agreement: { value: false }// , validators: [Validators.requiredTrue] },
  },
  { onChangeValidation: false },
  { validator: passwordMatchValidator, errorMsg: 'Password doesn\'t match' });
  const [submitResult, setSubmitResult] = useState();

  function passwordMatchValidator(values) {
    return values.password === values.passwordConfirm;
 }

  function submitForm() {
    const values = formGroup.getRawValues();
    console.log(values);
    if (values) {
      setSubmitResult(values);
    }
  }

  function agreementHandler(event) {
    formGroup.setValue(event);
    if (event.target.checked) {
      formGroup.registerControl({ name: 'additionalField' });
    } else {
      formGroup.unregisterControl('additionalField');
    }
  }

  return (
    <section className="grid">
      <div className="panel">
        {formGroup.hasError ? (
          <strong className="error-msg">{formGroup.error}</strong>
        ) : null}
        <section>
          <strong>First name</strong>
          <br />
          <input
            type="text"
            name="firstName"
            className={classNames({ error: formGroup.errors.firstName }, 'input-el')}
            value={formGroup.values.firstName}
            onChange={formGroup.setValue}
            onBlur={formGroup.runValidation}
          />
          {formGroup.errors.firstName ? (
            <p className="error-msg">{formGroup.errors.firstName}</p>
          ) : null}
        </section>
        <section>
          <strong>Last name</strong>
          <br />
          <input
            type="text"
            name="lastName"
            className={classNames({ error: formGroup.errors.lastName }, 'input-el')}
            value={formGroup.values.lastName}
            onChange={formGroup.setValue}
            onBlur={formGroup.runValidation}
          />
          {formGroup.errors.lastName ? (
            <p className="error-msg">{formGroup.errors.lastName}</p>
          ) : null}
        </section>
        <section>
          <strong>Password</strong>
          <br />
          <input
            type="password"
            name="password"
            className={classNames({ error: formGroup.errors.password }, 'input-el')}
            value={formGroup.values.password}
            onChange={formGroup.setValue}
            onBlur={formGroup.runValidation}
          />
          {formGroup.errors.password ? (
            <p className="error-msg">Min 6 characters</p>
          ) : null}
        </section>
        <section>
          <strong>Confirm password</strong>
          <br />
          <input
            type="password"
            name="passwordConfirm"
            className={classNames({ error: formGroup.errors.passwordConfirm }, 'input-el')}
            value={formGroup.values.passwordConfirm}
            onChange={formGroup.setValue}
            onBlur={formGroup.runValidation}
          />
          {formGroup.errors.passwordConfirm ? (
            <p className="error-msg">Min 6 characters</p>
          ) : null}
        </section>
        <section>
          <strong>Job title</strong>
          <br />
          <select name="jobTitle" value={formGroup.values.jobTitle} onChange={formGroup.setValue}>
            <option value="admin">Administrator</option>
            <option value="manager">Manager</option>
            <option value="customer">Customer</option>
          </select>
        </section>
        <section>
          <strong>Sex</strong>
          <br />
          <fieldset onChange={formGroup.setValue}>
            <div>
              <input type="radio" name="sex" value="male" />
              Male
            </div>
            <div>
              <input type="radio" name="sex" value="female" />
              Female
            </div>
          </fieldset>
          {formGroup.errors.sex ? (
            <p className="error-msg">This is required</p>
          ) : null}
        </section>
        <section>
          <strong>Notes</strong>
          <br />
          <textarea name="notes" value={formGroup.values.notes} onChange={formGroup.setValue} />
        </section>
        <section>
          <input type="checkbox" name="agreement" checked={formGroup.values.agreement} onChange={agreementHandler} />
          Agreement
          {formGroup.errors.agreement ? (
            <p className="error-msg">This is required</p>
          ) : null}
        </section>
        {formGroup.values.agreement ? (
          <section>
            <strong>Additional Field</strong>
            <br />
            <input
              type="text"
              name="additionalField"
              className={classNames({ error: formGroup.errors.additionalField }, 'input-el')}
              value={formGroup.values.additionalField}
              onChange={formGroup.setValue}
              onBlur={formGroup.runValidation}
            />
            {formGroup.errors.additionalField ? (
              <p className="error-msg">{formGroup.errors.additionalField}</p>
            ) : null}
          </section>
        ) : null}
        <button className="btn" onClick={() => formGroup.reset()}>Reset</button>
        <button
          className={classNames({ disabled: !formGroup.isValid || !formGroup.isDirty }, 'btn mrl-5')}
          onClick={submitForm}
        >
          Submit
        </button>
      </div>
      <div className="panel">
        &#123;
        <ul>
          {submitResult ? Object.entries(submitResult).map(([field, value]) => (
            <li key={field}>{field}: {value}</li>
          )) : null}
          
        </ul>
        &#125;
      </div>
    </section>
  );
}

export default FormGroup;
