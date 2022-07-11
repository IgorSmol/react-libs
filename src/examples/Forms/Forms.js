import { useState } from 'react';
import FormControl from './FormControl';
import FormGroup from './FormGroup';

function Forms() {
  const [example, setExample] = useState('control');

  return (
    <>
      <header className="text--center">
        <button className="btn" onClick={() => setExample('control')}>Form Control</button>
        <button className="btn mrl-5" onClick={() => setExample('group')}>Form Group</button>
      </header>
      {example === 'control' ? <FormControl /> : null}
      {example === 'group' ? <FormGroup /> : null}
    </>
  );
}

export default Forms;
