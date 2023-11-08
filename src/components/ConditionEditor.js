import React, { useContext } from 'react';
import * as Model from '../model.js';
import { NarrativeContext } from "./context.js"

const CONDITIONS = ["Always", "Has Object", "Has State"]

function conditionFromString(condition, str) {
  switch (str) {
    case CONDITIONS[0]: Model.makeAlways(condition); break;
    case CONDITIONS[1]: Model.makeHasObject(condition); break;
    case CONDITIONS[2]: Model.makeHasState(condition); break;
    default: break;
  }
}

function conditionToString(condition) {
  if (Model.isAlways(condition)) {
    return CONDITIONS[0];
  } else if (Model.isHasObject(condition)) {
    return CONDITIONS[1];
  } else if (Model.isHasState(condition)) {
    return CONDITIONS[2];
  }
}

export default function ConditionEditor(props) {
  const narrative = useContext(NarrativeContext);
  const id = React.useId();
  const selectId = `${id}-condition-select`;
  const entitySelectId = `${id}-condition-entity-select`;
  const objectSelectId = `${id}-condition-object-select`;
  const entityOrObjectSelectId = `${id}-condition-entity-object-select`;
  const stateKeySelectId = `${id}-condition-state-key-select`;
  const stateValueSelectId = `${id}-condition-state-value-select`;
  const entitySelectDisplay = Model.isHasObject(props.condition);
  const objectSelectDisplay = Model.isHasObject(props.condition);
  const entityOrObjectSelectDisplay = Model.isHasState(props.condition);
  const stateKeySelectDisplay = Model.isHasState(props.condition);
  const stateValueSelectDisplay = Model.isHasState(props.condition);
  return (
    <div className="horizontal-layout">
      <form onSubmit={(event) => event.preventDefault()}>
        <label htmlFor={selectId} className="header-item">Availability:
          <button
            className="header-item content-button"
            onClick={event => { props.condition.not = !props.condition.not; props.setCondition(props.condition); }}>
            {props.condition.not ? "Not" : "‎"}
          </button>
          <select
            id={selectId}
            className="header-item"
            value={conditionToString(props.condition)}
            onChange={event => {
              conditionFromString(props.condition, event.target.value);
              props.setCondition(props.condition);
            }}>
            {CONDITIONS.map(condition => (<option key={condition}>{condition}</option>))}
          </select>
        </label>
        <label htmlFor={entitySelectId} className="header-item" hidden={!entitySelectDisplay}>Entity:
          <select
            id={entitySelectId}
            type="text" className="header-item"
            hidden={!entitySelectDisplay}
            value={Model.isHasObject(props.condition) ? props.condition.hasObject.entity : ""}
            onChange={event => { props.condition.hasObject.entity = event.target.value; props.setCondition(props.condition); }}>
            {narrative.realm.entities.map(entity => (<option key={entity.key}>{entity.key}</option>))}
          </select>
        </label>
        <label htmlFor={objectSelectId} className="header-item" hidden={!objectSelectDisplay}>Object:
          <select id={objectSelectId}
            type="text"
            className="header-item"
            hidden={!objectSelectDisplay}
            value={Model.isHasObject(props.condition) ? props.condition.hasObject.object : ""}
            onChange={event => { props.condition.hasObject.object = event.target.value; props.setCondition(props.condition); }}>
            {narrative.realm.objects.map(object => (<option key={object.key}>{object.key}</option>))}
          </select>
        </label>
        <label htmlFor={entityOrObjectSelectId} className="header-item" hidden={!entityOrObjectSelectDisplay}>Source:
          <select id={entityOrObjectSelectId}
            type="text"
            className="header-item"
            hidden={!entityOrObjectSelectDisplay}
            value={Model.isHasState(props.condition) ? props.condition.hasState.source : ""}
            onChange={event => { props.condition.hasState.source = event.target.value; props.setCondition(props.condition); }}>
            {narrative.realm.entities.map(entity => (<option key={entity.key}>{entity.key}</option>))}
            {narrative.realm.objects.map(object => (<option key={object.key}>{object.key}</option>))}
          </select>
        </label>
        <label htmlFor={stateKeySelectId} className="header-item" hidden={!stateKeySelectDisplay}>Key:
          <input
            id={stateKeySelectId}
            type="text" className="header-item"
            hidden={!stateKeySelectDisplay}
            size="16"
            value={Model.isHasState(props.condition) ? props.condition.hasState.key : ""}
            onChange={event => { props.condition.hasState.key = event.target.value; props.setCondition(props.condition); }}>
          </input>
        </label>
        <label htmlFor={stateValueSelectId} className="header-item" hidden={!stateValueSelectDisplay}>Value:
          <input
            id={stateValueSelectId}
            type="text"
            className="header-item"
            hidden={!stateValueSelectDisplay}
            size="16"
            value={Model.isHasState(props.condition) ? props.condition.hasState.value : ""}
            onChange={event => { props.condition.hasState.value = event.target.value; props.setCondition(props.condition); }}>
          </input>
        </label>
      </form>
    </div>
  );
}
