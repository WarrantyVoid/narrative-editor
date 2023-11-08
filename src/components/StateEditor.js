import React from 'react';

export default function StateEditor(props) {
  const id = React.useId();
  const KeySelectId = `${id}-state-key-select`;
  const ValueSelectId = `${id}-state-value-select`;
  return (
    <li className="state-editor horizontal-layout">
      <form onSubmit={(event) => event.preventDefault()}>
        <label htmlFor={KeySelectId} className="header-item">Key:
          <input
            id={KeySelectId}
            type="text"
            className="header-item"
            size="16"
            value={props.state.key}
            onChange={event => { props.state.key = event.target.value; props.setState(props.state); }} />
        </label>
        <label htmlFor={ValueSelectId} className="header-item">Value:
          <input
            id={ValueSelectId}
            type="text"
            className="header-item"
            size="16"
            value={props.state.value}
            onChange={event => { props.state.value = event.target.value; props.setState(props.state); }} />
        </label>
      </form>
    </li>
  );
}