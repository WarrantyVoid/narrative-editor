import React, { useContext } from 'react';
import * as Model from '../model.js';
import { NarrativeContext } from "./context.js"

const REALM_EFFECTS = ["Give Object", "Set State", "AdjustState"]

function realmEffectFromString(effect, str) {
  switch (str) {
    case REALM_EFFECTS[0]: Model.makeGiveObject(effect); break;
    case REALM_EFFECTS[1]: Model.makeSetState(effect); break;
    case REALM_EFFECTS[2]: Model.makeAdjustState(effect); break;
    default: break;
  }
}

function realmEffectToString(effect) {
  if (Model.isGiveObject(effect)) {
    return REALM_EFFECTS[0];
  } else if (Model.isSetState(effect)) {
    return REALM_EFFECTS[1];
  } else if (Model.isAdjustState(effect)) {
    return REALM_EFFECTS[2];
  }
}

export default function RealmEffectEditor(props) {
  const narrative = useContext(NarrativeContext);
  const id = React.useId();
  const selectId = `${id}-effect-select`;
  const entitySelectId = `${id}-effect-entity-select`;
  const objectSelectId = `${id}-effect-object-select`;
  const entityOrObjectSelectId = `${id}-effect-entity-object-select`;
  const stateKeySelectId = `${id}-effect-state-key-select`;
  const stateValueSelectId = `${id}-effect-state-value-select`;
  const entitySelectDisplay = Model.isGiveObject(props.effect);
  const objectSelectDisplay = Model.isGiveObject(props.effect);
  const entityOrObjectSelectDisplay = Model.isSetState(props.effect) || Model.isAdjustState(props.effect);
  const stateKeySelectDisplay = Model.isSetState(props.effect) || Model.isAdjustState(props.effect);
  const stateValueSelectDisplay = Model.isSetState(props.effect) || Model.isAdjustState(props.effect);
  return (
    <li className="effect-editor horizontal-layout">
      <form onSubmit={(event) => event.preventDefault()}>
        <label htmlFor={selectId} className="header-item">Effect:
          <select
            id={selectId}
            className="header-item"
            value={realmEffectToString(props.effect)}
            onChange={event => {
              realmEffectFromString(props.effect, event.target.value);
              props.setEffect(props.effect);
            }}
          >
            {REALM_EFFECTS.map(effect => (<option key={effect}>{effect}</option>))}
          </select>
        </label>
        <label
          htmlFor={entitySelectId}
          className="header-item"
          hidden={!entitySelectDisplay}>
          Target:
          <select
            id={entitySelectId}
            type="text"
            className="header-item"
            hidden={!entitySelectDisplay}
            value={Model.isGiveObject(props.effect) ? props.effect.giveObject.entity : ""}
            onChange={event => { props.effect.giveObject.entity = event.target.value; props.setEffect(props.effect); }}>
            {narrative.realm.entities.map(entity => (<option key={entity.key}>{entity.key}</option>))}
          </select>
        </label>
        <label
          htmlFor={objectSelectId}
          className="header-item"
          hidden={!objectSelectDisplay}>
          Object:
          <select
            id={objectSelectId}
            type="text"
            className="header-item"
            hidden={!objectSelectDisplay}
            value={Model.isGiveObject(props.effect) ? props.effect.giveObject.object : ""}
            onChange={event => { props.effect.giveObject.object = event.target.value; props.setEffect(props.effect); }}>
            {narrative.realm.objects.map(objects => (<option key={objects.key}>{objects.key}</option>))}
          </select>
        </label>
        <label
          htmlFor={entityOrObjectSelectId}
          className="header-item"
          hidden={!entityOrObjectSelectDisplay}>
          Target:
          <select
            id={entityOrObjectSelectId}
            type="text"
            className="header-item"
            hidden={!entityOrObjectSelectDisplay}
            value={Model.isSetState(props.effect) ? props.effect.setState.source : Model.isAdjustState(props.effect) ? props.effect.adjustState.source : ""}
            onChange={event => { Model.isSetState(props.effect) ? props.effect.setState.source = event.target.value : props.effect.adjustState.source = event.target.value; props.setEffect(props.effect); }}>
            {narrative.realm.entities.map(entity => (<option key={entity.key}>{entity.key}</option>))}
            {narrative.realm.objects.map(objects => (<option key={objects.key}>{objects.key}</option>))}
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
            value={Model.isSetState(props.effect) ? props.effect.setState.key : Model.isAdjustState(props.effect) ? props.effect.adjustState.key : ""}
            onChange={event => { Model.isSetState(props.effect) ? props.effect.setState.key = event.target.value : props.effect.adjustState.key = event.target.value; props.setEffect(props.effect); }}>
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
            value={Model.isSetState(props.effect) ? props.effect.setState.value : Model.isAdjustState(props.effect) ? props.effect.adjustState.value : ""}
            onChange={event => { Model.isSetState(props.effect) ? props.effect.setState.value = event.target.value : props.effect.adjustState.value = event.target.value; props.setEffect(props.effect); }}>
          </input>
        </label>
      </form>
    </li>
  );
}
