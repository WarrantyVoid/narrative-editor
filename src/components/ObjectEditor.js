import React, { useContext } from 'react';
import * as Model from '../model.js';
import { NarrativeContext } from "./context.js"
import ObjectEffectEditor from "./ObjectEffectEditor.js";
import StateEditor from "./StateEditor.js";
import StringEditor from "./StringEditor.js";

export default function ObjectEditor(props) {
  const narrative = useContext(NarrativeContext);
  const id = React.useId();
  const editId = `${id}-edit`;
  const ownerSelectId = `${id}-owner-select`;
  return (
    <li className="object-editor">
      <StringEditor
        id={editId}
        className="subtitle-editor object-header"
        value={props.name}
        onEdit={(v) => { props.onKeyChange(v); }} />
      <label htmlFor={ownerSelectId} className="header-item">Owner:
        <select
          id={ownerSelectId}
          className="header-item"
          value={props.object.owner}
          onChange={event => { props.object.owner = event.target.value; props.setObject(props.opbject); }}>
          <option key=""></option>
          {narrative.realm.entities.map(entity => (<option key={entity.key}>{entity.key}</option>))}
        </select>
      </label>
      <div className="horizontal-layout">
        <img src="effect18.png" alt="Effect Icon" className="header-item" />
        <h4>
          <span className="header-item">Effects</span>
          <button
            title="Add"
            className="header-item title-button"
            onClick={() => { props.object.effects.push(new Model.ObjectEffect()); props.setObject(props.object); }}>
            +
          </button>
          <button
            title="Del"
            className="header-item title-button"
            onClick={() => { props.object.effects.pop(); props.setObject(props.object); }}>
            -
          </button>
        </h4>
      </div>
      <ul>
        {props.object.effects.map(effect => (
          <ObjectEffectEditor
            key={props.object.effects.indexOf(effect)}
            effect={effect}
            setEffect={(effect) => { props.object.effects[props.object.effects.indexOf(effect)] = effect; props.setObject(props.object); }} />))}
      </ul>
      <div className="object-state-box">
        <div className="horizontal-layout">
          <img src="state18.png" alt="State Icon" className="header-item" />
          <h4>
            <span className="header-item">State</span>
            <button
              title="Add"
              className="header-item title-button"
              onClick={() => { props.object.states.push(new Model.State()); props.setObject(props.object); }}>
              +
            </button>
            <button
              title="Del"
              className="header-item title-button"
              onClick={() => { props.object.states.pop(); props.setObject(props.object); }}>
              -
            </button>
          </h4>
        </div>
        <ul>
          {props.object.states.map(entry => (
            <StateEditor
              key={props.object.states.indexOf(entry)}
              state={entry}
              setState={(state) => { props.setObject(props.object); }}
            />))}
        </ul>
      </div>
    </li>
  );
}