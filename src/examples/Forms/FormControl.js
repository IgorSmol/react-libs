import useFormControl from '../../hooks/FormHook/useFormControl';
import Validators from '../../utils/validators.util';
import classNames from '../../libs/classNames';

function FormControl() {
  const inputField = useFormControl(
    '',
    {
      validators: [Validators.pattern(/^\d+$/)],
      validateOnChange: true,
    }
  );
  const inputField2 = useFormControl(
    '',
    {
      limitations: [Validators.maxLength(5)],
      validators: [
        [Validators.required, 'This required'],
        [Validators.pattern(/^[A-Za-z]+$/), 'Not valid'],
      ],
    }
  );
  const textArea = useFormControl();
  const selection = useFormControl('opt3');
  const checkbox = useFormControl(true);
  const radio = useFormControl();

  return (
    <section className="grid">
      <div className="panel">
        <h3>With onChange validation</h3>
        <input
          type="text"
          className={classNames({ error: inputField.hasError }, 'input-el')}
          value={inputField.value}
          onChange={inputField.setValue}
          onBlur={inputField.runValidation}
          disabled={inputField.isDisabled}
        />
        {inputField.hasError ? (
          <p className="error-msg">Some error message</p>
        ) : null}
        <section>
          <button onClick={() => inputField.reset()}>Reset</button>
          <button onClick={() => inputField.reset(444)}>Reset with '444'</button>
          <button onClick={() => inputField.reset(null, { disabled: true })}>Reset and disabel</button>
          <button onClick={() => inputField.setError('Some error fron button')}>Set error message</button>
        </section>
      </div>
      <div className="panel">
        <h3>With limitation and onBlur validation</h3>
        <input
          type="text"
          className={classNames({ error: inputField2.hasError }, 'input-el')}
          value={inputField2.value}
          onChange={inputField2.setValue}
          onBlur={inputField2.runValidation}
        />
        {inputField2.hasError ? (
          <p className="error-msg">{inputField2.error}</p>
        ) : null}
        <section>
          <button onClick={() => inputField2.reset()}>Reset</button>
          <button onClick={() => inputField2.reset('Text')}>Reset with 'Text'</button>
          <button onClick={() => inputField2.setError('Some error fron button')}>Set error message</button>
        </section>
      </div>
      <div className="panel">
        <h3>Textarea field</h3>
        <textarea value={textArea.value} onChange={textArea.setValue} />
        <section>
          <button onClick={() => textArea.reset()}>Reset</button>
          <button onClick={() => textArea.reset('Some text...')}>Reset with new text</button>
        </section>
      </div>
      <div className="panel">
        <h3>Select field</h3>
        <select value={selection.value} onChange={selection.setValue} disabled={selection.isDisabled}>
          <option value="opt1">Option 1</option>
          <option value="opt2">Option 2</option>
          <option value="opt3">Option 3</option>
        </select>
        <section>
          <button onClick={() => selection.reset()}>Reset</button>
          <button onClick={() => selection.reset('opt1', { disabled: true })}>Reset and disabel</button>
        </section>
      </div>
      <div className="panel">
        <h3>Checkbox field</h3>
        <input type="checkbox" checked={checkbox.value} onChange={checkbox.setValue} disabled={checkbox.isDisabled} />
        <section>
          <button onClick={() => checkbox.reset()}>Reset</button>
          <button onClick={() => checkbox.reset(false, { disabled: true })}>Reset and disabel</button>
        </section>
      </div>
      <div className="panel">
        <h3>Radio field</h3>
        <div>
          <input
            type="radio"
            checked={radio.value === 'Test1'}
            value="Test1"
            onChange={radio.setValue}
            disabled={radio.isDisabled}
          />
          Test1
        </div>
        <div>
          <input
            type="radio"
            checked={radio.value === 'Test2'}
            value="Test2"
            onChange={radio.setValue}
            disabled={radio.isDisabled}
          />
          Test2
        </div>
        <section>
          <button onClick={() => radio.reset()}>Reset</button>
          <button onClick={() => radio.reset('Test2', { disabled: true })}>Reset and disabel</button>
        </section>
      </div>
    </section>
  );
}

export default FormControl;
