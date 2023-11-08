import React from 'react';
import * as Model from '../model.js';

const OBJECT_EFFECTS = ["Adjust Owner State"]

function objectEffectFromString(effect, str) {
  switch (str) {
    case OBJECT_EFFECTS[0]: Model.makeAdjustOwnerState(effect); break;
    default: break;
  }
}

function objectEffectToString(effect) {
  if (Model.isAdjustOwnerState(effect)) {
    return OBJECT_EFFECTS[0];
  }
}

export default function ObjectEffectEditor(props) {
  const id = React.useId();
  const selectId = `${id}-object-effect-select`;
  const stateKeySelectId = `${id}-object-effect-state-key-select`;
  const stateValueSelectId = `${id}-object-effect-state-value-select`;
  const stateKeySelectDisplay = Model.isAdjustOwnerState(props.effect);
  const stateValueSelectDisplay = Model.isAdjustOwnerState(props.effect);
  return (
    <li className="effect-editor horizontal-layout">
      <form onSubmit={(event) => event.preventDefault()}>
        <label htmlFor={selectId} className="header-item">Effect:
        <select
          id={selectId}
          className="header-item"
          value={objectEffectToString(props.effect)}
          onChange={event => {
            objectEffectFromString(props.effect, event.target.value);
            props.setEffect(props.effect);
          }}
        >
          {OBJECT_EFFECTS.map(effect => (<option key={effect}>{effect}</option>))}
        </select>
        </label>
        <label
          htmlFor={stateKeySelectId}
          className="header-item"
          hidden={!stateKeySelectDisplay}>
          Key:
        <input
          id={stateKeySelectId}
          type="text"
          className="header-item"
          hidden={!stateKeySelectDisplay}
          size="16"
          value={Model.isAdjustOwnerState(props.effect) ? props.effect.adjustOwnerState.key : ""}
          onChange={event => { props.effect.adjustOwnerState.key = event.target.value; props.setEffect(props.effect); }}>
        </input>
        </label>
        <label
          htmlFor={stateValueSelectId}
          className="header-item"
          hidden={!stateValueSelectDisplay}>
          Value:
        <input
          id={stateValueSelectId}
          type="text"
          className="header-item"
          hidden={!stateValueSelectDisplay}
          size="16"
          value={Model.isAdjustOwnerState(props.effect) ? props.effect.adjustOwnerState.value : ""}
          onChange={event => { props.effect.adjustOwnerState.value = event.target.value; props.setEffect(props.effect); }}>
        </input>
        </label>
      </form>
    </li>
  );
}